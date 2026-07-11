import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { g as addAttribute, i as renderComponent, m as maybeRenderHead, u as renderTemplate, x as createAstro } from "./server_C4xiHXPV.mjs";
import { t as createComponent } from "./compiler_Cgq5QwYA.mjs";
import { t as $$Layout } from "./Layout_DoSLfcpR.mjs";
import { createClient } from "@supabase/supabase-js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//#region src/lib/server-services.ts
var supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
var r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
var r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
var r2Endpoint = process.env.R2_ENDPOINT;
var r2BucketName = process.env.R2_BUCKET_NAME || "padelview-matches";
/**
* Supabase client instance for server-side queries.
*/
var getSupabase = () => {
	if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set.");
	return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
};
/**
* Generates a temporary Presigned URL for viewing/downloading an R2 video.
*/
async function getSignedVideoUrl(videoKey, filename) {
	if (!r2AccessKeyId || !r2SecretAccessKey || !r2Endpoint) throw new Error("Cloudflare R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT) are not set.");
	return await getSignedUrl(new S3Client({
		region: "auto",
		endpoint: r2Endpoint,
		credentials: {
			accessKeyId: r2AccessKeyId,
			secretAccessKey: r2SecretAccessKey
		}
	}), new GetObjectCommand({
		Bucket: r2BucketName,
		Key: videoKey,
		ResponseContentDisposition: `attachment; filename="${filename}"`
	}), { expiresIn: 7200 });
}
//#endregion
//#region src/pages/partido/[match_id].astro
var _match_id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$MatchId,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$MatchId = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MatchId;
	const { match_id } = Astro.params;
	let match = null;
	let signedUrl = null;
	let errorMessage = null;
	let isLoadingState = false;
	try {
		if (!match_id) throw new Error("Identificador de partido no especificado.");
		const { data, error } = await getSupabase().from("matches").select("*, courts(name)").eq("id", match_id).single();
		if (error || !data) {
			console.error("Database query error:", error);
			errorMessage = "El partido no existe o el enlace es incorrecto.";
		} else {
			match = data;
			if (match.status === "DONE") if (!match.video_key) errorMessage = "El video fue procesado pero no se encuentra en el almacenamiento.";
			else {
				const dateStr = new Date(match.start_time).toISOString().split("T")[0];
				const filename = `PadelView_${match.courts?.name.replace(/[^a-zA-Z0-9]/g, "_") || "cancha"}_${dateStr}.mp4`;
				signedUrl = await getSignedVideoUrl(match.video_key, filename);
			}
			else if (match.status === "RECORDING" || match.status === "UPLOADING") isLoadingState = true;
			else if (match.status === "FAILED") errorMessage = "Hubo un inconveniente técnico al procesar el video de este partido.";
		}
	} catch (err) {
		console.error("Server loading error:", err);
		errorMessage = err.message || "Error del servidor al intentar cargar el partido.";
	}
	const formattedDate = match ? new Date(match.start_time).toLocaleDateString("es-AR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "";
	const formattedTime = match ? `${new Date(match.start_time).toLocaleTimeString("es-AR", {
		hour: "2-digit",
		minute: "2-digit"
	})} a ${new Date(match.end_time).toLocaleTimeString("es-AR", {
		hour: "2-digit",
		minute: "2-digit"
	})} hs` : "";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": match ? `Partido de ${match.player_name} - PadelView` : "PadelView",
		"data-astro-cid-yzu7ovuy": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="web-container" data-astro-cid-yzu7ovuy><header class="web-header" data-astro-cid-yzu7ovuy><div class="logo" data-astro-cid-yzu7ovuy><div class="logo-icon" data-astro-cid-yzu7ovuy>PV</div><div class="logo-text" data-astro-cid-yzu7ovuy><h1 data-astro-cid-yzu7ovuy>PadelView</h1><span data-astro-cid-yzu7ovuy>Sportivo Belgrano</span></div></div>${match && renderTemplate`<div class="court-badge" data-astro-cid-yzu7ovuy>${match.courts?.name || "Cancha Registrada"}</div>`}</header><main class="web-main" data-astro-cid-yzu7ovuy>${errorMessage && renderTemplate`<div class="status-card error-card" data-astro-cid-yzu7ovuy><div class="status-icon" data-astro-cid-yzu7ovuy>⚠️</div><h2 data-astro-cid-yzu7ovuy>¡Ups! Algo no salió bien</h2><p class="error-msg" data-astro-cid-yzu7ovuy>${errorMessage}</p><div class="support-footer" data-astro-cid-yzu7ovuy><p data-astro-cid-yzu7ovuy>Si consideras que esto es un error, contacta a la administración de Sportivo Belgrano.</p><a href="/" class="btn btn-secondary" data-astro-cid-yzu7ovuy>Volver al inicio</a></div></div>`}${!errorMessage && isLoadingState && match && renderTemplate`<div class="status-card loading-card" data-astro-cid-yzu7ovuy><div class="spinner-container" data-astro-cid-yzu7ovuy><div class="main-spinner" data-astro-cid-yzu7ovuy></div><div class="pulse-dot" data-astro-cid-yzu7ovuy></div></div><h2 data-astro-cid-yzu7ovuy>Tu partido se está procesando</h2><p class="status-description" data-astro-cid-yzu7ovuy>${match.status === "RECORDING" ? "La cámara está grabando en vivo en este momento." : "El video se está subiendo al almacenamiento en la nube."}</p><div class="details-box" data-astro-cid-yzu7ovuy><div class="detail-row" data-astro-cid-yzu7ovuy><span class="label" data-astro-cid-yzu7ovuy>Jugador:</span><span class="val" data-astro-cid-yzu7ovuy>${match.player_name}</span></div><div class="detail-row" data-astro-cid-yzu7ovuy><span class="label" data-astro-cid-yzu7ovuy>Horario:</span><span class="val" data-astro-cid-yzu7ovuy>${formattedTime}</span></div><div class="detail-row" data-astro-cid-yzu7ovuy><span class="label" data-astro-cid-yzu7ovuy>Estado actual:</span><span class="val status-pill" data-astro-cid-yzu7ovuy>${match.status === "RECORDING" ? "🔴 GRABANDO EN VIVO" : "⚡ SUBIENDO VIDEO..."}</span></div></div><p class="refresh-hint" data-astro-cid-yzu7ovuy>Esta página se actualizará automáticamente cuando esté listo.</p><script>
            // Auto refresh every 30 seconds
            setTimeout(() => {
              window.location.reload();
            }, 30000);
          <\/script></div>`}${!errorMessage && !isLoadingState && match && signedUrl && renderTemplate`<div class="video-container-card" data-astro-cid-yzu7ovuy><div class="video-wrapper" data-astro-cid-yzu7ovuy><video id="player" controls preload="metadata" playsinline${addAttribute(signedUrl, "src")} data-astro-cid-yzu7ovuy>Tu navegador no soporta reproducción de video HTML5.</video></div><div class="video-details-section" data-astro-cid-yzu7ovuy><div class="match-meta" data-astro-cid-yzu7ovuy><span class="date" data-astro-cid-yzu7ovuy>${formattedDate}</span><h2 data-astro-cid-yzu7ovuy>Partido de ${match.player_name}</h2><p class="time-court" data-astro-cid-yzu7ovuy>${formattedTime} | ${match.courts?.name}</p></div><div class="action-buttons" data-astro-cid-yzu7ovuy><a${addAttribute(signedUrl, "href")} download class="btn btn-primary btn-lg" data-astro-cid-yzu7ovuy><span class="btn-icon" data-astro-cid-yzu7ovuy>📥</span>Descargar Video Completo</a><button id="share-btn" class="btn btn-secondary btn-lg"${addAttribute(`
                  if(navigator.share) {
                    navigator.share({
                      title: 'Mi partido en Sportivo Belgrano',
                      text: '¡Mira la grabación de mi partido en PadelView!',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('¡Enlace copiado al portapapeles!');
                  }
                `, "onclick")} data-astro-cid-yzu7ovuy><span class="btn-icon" data-astro-cid-yzu7ovuy>🔗</span>Compartir Enlace</button></div></div></div>`}</main><footer class="web-footer" data-astro-cid-yzu7ovuy><p data-astro-cid-yzu7ovuy>© ${(/* @__PURE__ */ new Date()).getFullYear()} PadelView. Desarrollado para Club Sportivo Belgrano.</p></footer></div>` })}`;
}, "D:/Dev/ViewPadel/web-portal/src/pages/partido/[match_id].astro", void 0);
var $$file = "D:/Dev/ViewPadel/web-portal/src/pages/partido/[match_id].astro";
var $$url = "/partido/[match_id]";
//#endregion
//#region \0virtual:astro:page:src/pages/partido/[match_id]@_@astro
var page = () => _match_id__exports;
//#endregion
export { page };
