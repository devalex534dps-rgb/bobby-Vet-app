import { bobbySwal } from "@/lib/sweetalert";

/**
 * Muestra un diálogo de confirmación moderno y estilizado para eliminar un paciente.
 * Diseñado con la estética glassmórfica y paleta semántica de Bobby VetCare.
 */
export async function confirmDeletePatientAlert(patientName: string): Promise<boolean> {
  const result = await bobbySwal.fire({
    title: `¿Eliminar a ${patientName}?`,
    html: `
      <div style="display:flex; flex-direction:column; gap:0.875rem; text-align:center;">
        <p style="margin:0; font-size:0.875rem; color:#434751; line-height:1.5;">
          ¿Estás seguro de que deseas eliminar permanentemente el expediente clínico de <strong style="color:#0c1b33; font-weight:700;">${patientName}</strong> del directorio?
        </p>
        <div style="display:flex; align-items:flex-start; gap:0.625rem; padding:0.75rem 0.875rem; border-radius:0.875rem; background:#fff1f2; border:1px solid #fecdd3; text-align:left;">
          <svg style="width:1.125rem; height:1.125rem; color:#e11d48; flex-shrink:0; margin-top:0.1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div style="font-size:0.75rem; color:#9f1239; line-height:1.4;">
            <span style="font-weight:600; display:block;">Acción irreversible</span>
            Se removerán todas las consultas, recetas y vacunas vinculadas a este paciente.
          </div>
        </div>
      </div>
    `,
    iconHtml: `
      <div class="bobby-swal-icon-danger">
        <svg xmlns="http://www.w3.org/2000/svg" style="width:1.85rem; height:1.85rem; color:#e11d48;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: `
      <span style="display:inline-flex; align-items:center; gap:0.35rem;">
        <svg style="width:0.95rem; height:0.95rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        Sí, eliminar paciente
      </span>
    `,
    cancelButtonText: "Conservar paciente",
    customClass: {
      container: "bobby-swal-container",
      popup: "bobby-swal-popup",
      title: "bobby-swal-title",
      htmlContainer: "bobby-swal-html",
      confirmButton: "bobby-swal-danger-btn",
      cancelButton: "bobby-swal-cancel-btn",
      actions: "bobby-swal-actions",
      icon: "bobby-swal-icon",
    },
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}

/**
 * Notificación toast/modal de éxito
 */
export async function showSuccessToast(title: string, message?: string) {
  return bobbySwal.fire({
    title,
    text: message,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
}
