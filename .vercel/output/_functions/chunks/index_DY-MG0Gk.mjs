import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_C4xiHXPV.mjs";
import { t as createComponent } from "./compiler_Cgq5QwYA.mjs";
import { t as $$Layout } from "./Layout_DoSLfcpR.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "PadelView - Sportivo Belgrano",
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="landing-container" data-astro-cid-lcdefpme><header class="web-header" data-astro-cid-lcdefpme><div class="logo" data-astro-cid-lcdefpme><div class="logo-icon" data-astro-cid-lcdefpme>PV</div><div class="logo-text" data-astro-cid-lcdefpme><h1 data-astro-cid-lcdefpme>PadelView</h1><span data-astro-cid-lcdefpme>Sportivo Belgrano</span></div></div></header><main class="hero-section" data-astro-cid-lcdefpme><div class="hero-content" data-astro-cid-lcdefpme><span class="pill-badge" data-astro-cid-lcdefpme>NUEVO SERVICIO</span><h1 data-astro-cid-lcdefpme>Reviví tus partidos y compartí tus mejores jugadas</h1><p class="hero-description" data-astro-cid-lcdefpme>Grabación automática en alta definición de tus partidos de pádel en el club. Descargá, compartí y analizá tus jugadas fácilmente.</p><div class="search-card" data-astro-cid-lcdefpme><h3 data-astro-cid-lcdefpme>¿Tenés el código de tu partido?</h3><p class="search-hint" data-astro-cid-lcdefpme>Ingresá el identificador único (UUID) enviado a tu WhatsApp para acceder al video.</p><form class="search-form" id="search-form" data-astro-cid-lcdefpme><input type="text" id="match-id-input" placeholder="Ej. e29e92a8-f542-4911-b0db-bcf616cc3fdf" required pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" title="Debe ser un identificador UUID válido" data-astro-cid-lcdefpme><button type="submit" class="btn btn-primary" data-astro-cid-lcdefpme>Ver Partido</button></form><div id="error-message" class="error-msg hidden" data-astro-cid-lcdefpme>Por favor ingresa un código de partido válido.</div></div></div><div class="feature-grid" data-astro-cid-lcdefpme><div class="feature-card" data-astro-cid-lcdefpme><div class="feature-icon" data-astro-cid-lcdefpme>🎥</div><h3 data-astro-cid-lcdefpme>Cámaras HD en Vivo</h3><p data-astro-cid-lcdefpme>Grabamos tus partidos directamente desde el ángulo óptimo de la cancha sin interrupciones.</p></div><div class="feature-card" data-astro-cid-lcdefpme><div class="feature-icon" data-astro-cid-lcdefpme>⚡</div><h3 data-astro-cid-lcdefpme>Listos en Minutos</h3><p data-astro-cid-lcdefpme>Al finalizar tu turno, el video se procesa e importa a la nube automáticamente de forma súper rápida.</p></div><div class="feature-card" data-astro-cid-lcdefpme><div class="feature-icon" data-astro-cid-lcdefpme>📲</div><h3 data-astro-cid-lcdefpme>Compartí con un Clic</h3><p data-astro-cid-lcdefpme>Recibí el enlace en tu celular para descargarlo o reproducirlo directamente desde cualquier dispositivo móvil.</p></div></div></main><footer class="web-footer" data-astro-cid-lcdefpme><p data-astro-cid-lcdefpme>© ${(/* @__PURE__ */ new Date()).getFullYear()} PadelView. Desarrollado para Club Sportivo Belgrano.</p></footer></div>` })}<script>
  // Handle redirect to match details on form submit
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('match-id-input');
    const errorMsg = document.getElementById('error-message');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawValue = input.value.trim();
        
        // Simple UUID regex validation
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        
        if (uuidRegex.test(rawValue)) {
          errorMsg?.classList.add('hidden');
          window.location.href = \`/partido/\${rawValue}\`;
        } else {
          errorMsg?.classList.remove('hidden');
        }
      });
    }
  });
<\/script>`;
}, "D:/Dev/ViewPadel/web-portal/src/pages/index.astro", void 0);
var $$file = "D:/Dev/ViewPadel/web-portal/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
