"use client";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { SampleProof } from "@/components/molecules/SampleProof";
import type { AdminOrder } from "@/demo/admin/types";
import { formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "./useDemoSave";

const PROOF_STATE = { IN_REVIEW: { tone: "warning", label: "En revisión" }, APPROVED: { tone: "success", label: "Aprobado (demo)" }, REJECTED: { tone: "danger", label: "Rechazado" } } as const;

/** Revisión manual de transferencia/QR: aprobar solo después de verificar el ingreso en la cuenta (simulado). */
export function ProofReview({ order }: { order: AdminOrder }) {
  const { approveProof, rejectProof, receiveProof } = useAdmin();
  const save = useDemoSave();
  const proof = order.proof;
  if (order.paymentMethod === "CHECKOUT_PRO") return <p className="text-sm text-muted">Mercado Pago: no lleva comprobante. En producción el pago se confirma por webhook verificado, nunca a mano.</p>;
  if (!proof || proof.status === "REJECTED") {
    return (
      <div className="flex flex-col gap-3">
        {proof?.status === "REJECTED" && <p className="text-sm"><Badge tone="danger">Rechazado</Badge> Motivo: {proof.rejectReason}</p>}
        <p className="text-sm text-muted">Sin comprobante vigente. El pedido sigue pendiente de pago.</p>
        {order.status === "PENDING_PAYMENT" && (
          <ConfirmButton variant="secondary" size="sm" className="self-start" title="Simular comprobante recibido" confirmLabel="Simular"
            description="Así llega un comprobante subido por el comprador. El pedido pasa a revisión: subir un comprobante NUNCA lo marca como pagado."
            onConfirm={() => save("Comprobante simulado recibido", () => receiveProof(order.code, `comprobante-${order.code.slice(-3)}.jpg`))}>
            Simular comprobante recibido
          </ConfirmButton>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <SampleProof fileName={proof.fileName} amount={formatARS(order.total)} />
      <div className="flex flex-1 flex-col gap-2 text-sm">
        <p><Badge tone={PROOF_STATE[proof.status].tone}>{PROOF_STATE[proof.status].label}</Badge></p>
        <p className="text-muted">Recibido {formatDateTime(proof.receivedAt)} · Monto esperado {formatARS(order.total)} · Referencia {order.code}</p>
        {proof.status === "IN_REVIEW" && (
          <>
            <p className="rounded-xl bg-warning-soft p-2 text-xs font-bold text-warning">Antes de aprobar, Velmar verifica el ingreso en su cuenta. En la demo no hay cuenta real: aprobar solo cambia el estado local.</p>
            <div className="flex flex-wrap gap-2">
              <ConfirmButton size="sm" title={`Aprobar comprobante de ${order.code}`} confirmLabel="Aprobar (demo)"
                description={<>¿Confirmás que verificaste el ingreso de <strong>{formatARS(order.total)}</strong>? El pedido pasa a <strong>Pagado</strong> en esta demo y queda en la auditoría.</>}
                onConfirm={() => save("Comprobante aprobado (demo)", () => approveProof(order.code))}>
                <Check size={16} aria-hidden="true" /> Aprobar
              </ConfirmButton>
              <ConfirmButton size="sm" variant="danger" title={`Rechazar comprobante de ${order.code}`} confirmLabel="Rechazar" reasonLabel="Motivo del rechazo"
                description="El pedido vuelve a pendiente de pago y el comprador puede subir otro comprobante."
                onConfirm={(reason) => save("Comprobante rechazado (demo)", () => rejectProof(order.code, reason))}>
                <X size={16} aria-hidden="true" /> Rechazar
              </ConfirmButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
