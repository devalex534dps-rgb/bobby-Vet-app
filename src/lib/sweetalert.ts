import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/**
 * Bobby VetCare Custom Themed SweetAlert
 * Configurado con la paleta de colores oficial del sistema:
 * Primary: #024594 | Primary Container: #2c5ead
 * Surface: #f9f9ff | Glassmorphic overlay & rounded modern cards
 */
export const bobbySwal = Swal.mixin({
  customClass: {
    container: "bobby-swal-container",
    popup: "bobby-swal-popup",
    title: "bobby-swal-title",
    htmlContainer: "bobby-swal-html",
    confirmButton: "bobby-swal-confirm-btn",
    cancelButton: "bobby-swal-cancel-btn",
    actions: "bobby-swal-actions",
    icon: "bobby-swal-icon",
  },
  buttonsStyling: false,
});

/**
 * Muestra el diálogo SweetAlert personalizado para confirmar el cierre de sesión.
 * @returns Promise<boolean> true si el usuario confirmó cerrar sesión, false si canceló.
 */
export async function confirmLogoutAlert(): Promise<boolean> {
  const result = await bobbySwal.fire({
    title: "¿Cerrar sesión?",
    html: `
      <div class="space-y-2">
        <p class="text-sm text-[#434751] font-normal leading-relaxed">
          ¿Estás seguro de que deseas salir de <strong class="font-semibold text-[#0c1b33]">Bobby VetCare OS</strong>?
        </p>
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e0effe]/70 border border-[#bae0fd] text-xs text-[#1d4586] font-medium">
          <svg class="w-3.5 h-3.5 text-[#2c5ead] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Tendrás que ingresar tus credenciales nuevamente
        </div>
      </div>
    `,
    iconHtml: `
      <div class="bobby-swal-icon-inner">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#024594]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Permanecer aquí",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}
