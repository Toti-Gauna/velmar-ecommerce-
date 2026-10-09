import type { Closure, CustomerProfile, Material, Pet, Recipe, WorkshopSettings } from "../fixtures/workshop";
import { slugify } from "./import/cells";
import { auditEntry, type AdminData, type WorkshopData } from "./defaults";
import { basePriceFor } from "./workshop/costs";
import { applyMaterialOp, type MaterialOp } from "./workshop/materials";

type Set = (fn: (s: AdminData) => Partial<AdminData>) => void;

export interface WorkshopActions {
  saveWorkshopSettings: (patch: Partial<WorkshopSettings>) => void;
  addClosure: (closure: Closure) => void;
  removeClosure: (date: string) => void;
  saveMaterial: (material: Material) => void;
  createMaterial: (name: string) => string;
  adjustMaterials: (ids: string[], op: MaterialOp, label: string) => void;
  saveRecipe: (slug: string, recipe: Recipe) => void;
  /** Lleva el precio "desde" del producto a `price` (las variantes conservan su diferencia). */
  applyPrice: (slug: string, price: number) => void;
  savePet: (email: string, pet: Pet) => void;
  removePet: (email: string, petId: string) => void;
  addCustomerNote: (email: string, text: string) => void;
  setCustomerBirthday: (email: string, birthday: string | undefined) => void;
}

const EMPTY_PROFILE: CustomerProfile = { pets: [], notes: [] };

export function createWorkshopActions(set: Set): WorkshopActions {
  const edit = (action: string, entity: string, fn: (w: WorkshopData) => Partial<WorkshopData>) =>
    set((s) => ({ workshop: { ...s.workshop, ...fn(s.workshop) }, audit: [auditEntry(action, entity), ...s.audit].slice(0, 80) }));
  const profile = (action: string, email: string, fn: (p: CustomerProfile) => CustomerProfile) =>
    edit(action, email, (w) => {
      const key = email.trim().toLowerCase();
      return { profiles: { ...w.profiles, [key]: fn(w.profiles[key] ?? EMPTY_PROFILE) } };
    });

  return {
    saveWorkshopSettings: (patch) => edit("Ajustes del taller", Object.keys(patch).join(", "), (w) => ({ settings: { ...w.settings, ...patch } })),
    addClosure: (c) => edit(`Día cerrado: ${c.name}`, c.date, (w) => ({
      settings: { ...w.settings, closures: [...w.settings.closures.filter((x) => x.date !== c.date), c].sort((a, b) => a.date.localeCompare(b.date)) },
    })),
    removeClosure: (date) => edit("Día cerrado quitado", date, (w) => ({ settings: { ...w.settings, closures: w.settings.closures.filter((c) => c.date !== date) } })),
    saveMaterial: (m) => edit("Insumo guardado", m.name, (w) => ({ materials: w.materials.some((x) => x.id === m.id) ? w.materials.map((x) => (x.id === m.id ? m : x)) : [...w.materials, m] })),
    createMaterial: (name) => {
      const id = `${slugify(name) || "insumo"}-${Date.now().toString(36)}`;
      edit("Insumo creado", name, (w) => ({ materials: [...w.materials, { id, name: name.trim(), unit: "u", costPerUnit: 0, stock: 0, minStock: 0 }] }));
      return id;
    },
    adjustMaterials: (ids, op, label) => edit(label, `${ids.length} insumos`, (w) => ({ materials: applyMaterialOp(w.materials, ids, op) })),
    saveRecipe: (slug, recipe) => edit("Receta de costo guardada", slug, (w) => ({ recipes: { ...w.recipes, [slug]: recipe } })),
    applyPrice: (slug, price) =>
      set((s) => ({
        data: { ...s.data, products: s.data.products.map((p) => (p.slug === slug ? { ...p, basePrice: basePriceFor(p, price) } : p)) },
        audit: [auditEntry(`Precio actualizado a $${price.toLocaleString("es-AR")}`, slug), ...s.audit].slice(0, 80),
      })),
    savePet: (email, pet) => profile(`Mascota guardada: ${pet.name}`, email, (p) => ({ ...p, pets: p.pets.some((x) => x.id === pet.id) ? p.pets.map((x) => (x.id === pet.id ? pet : x)) : [...p.pets, pet] })),
    removePet: (email, petId) => profile("Mascota quitada", email, (p) => ({ ...p, pets: p.pets.filter((x) => x.id !== petId) })),
    addCustomerNote: (email, text) => profile("Nota del cliente", email, (p) => ({ ...p, notes: [{ at: new Date().toISOString(), text: text.trim() }, ...p.notes] })),
    setCustomerBirthday: (email, birthday) => profile("Cumpleaños del cliente", email, (p) => ({ ...p, birthday })),
  };
}
