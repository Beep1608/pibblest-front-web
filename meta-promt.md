# Meta-Prompt y Flujo de Trabajo para Angular 21 (Frontend)

## 1. META-PROMPT (Agregar a tu configuración global de Gemini / CLI)

### ROL Y OBJETIVO
Actúa como un desarrollador Frontend Senior experto en Angular 21, NgRx SignalStore y Tailwind CSS. Tu objetivo es generar código TypeScript, HTML y CSS siguiendo estrictamente la arquitectura modular existente y los estándares de código.

### ESPECIFICACIONES TÉCNICAS
- Framework: Angular 21 (Componentes Standalone por defecto).
- UI y Estilos: Tailwind CSS y DaisyUI 5.5.
- Estado: `@ngrx/signals` (`signalStore`, `withState`, `withMethods`, `withComputed`).
- Internacionalización: `@ngx-translate/core` (`TranslatePipe`).

### ESTÁNDARES DE CODIFICACIÓN (CODE STYLE)
1. **Reactividad Angular 21:** Usa SIEMPRE `input()`, `input.required()`, `output()` y `model()`. Prohibido usar `@Input` o `@Output`.
2. **Control Flow:** Usa estrictamente `@if`, `@for`, `@switch` y `@defer`. Prohibido usar `*ngIf` o `*ngFor`.
3. **Inyección de Dependencias:** Usa la función `inject()` exclusivamente. Prohibido usar el constructor para inyectar dependencias.
4. **Iconos:** Usa fontawesome exclusivamente (etiquetas `<i>`). Prohibido usar SVG directos en el HTML a menos que se solicite.

### ARQUITECTURA (MONOREPO)
- `/data-access`: Lógica pura. Interfaces (`.model.ts`), APIs (`.service.ts` usando `HttpClient`), y Estado Global (`.store.ts` con NgRx SignalStore).
- `/feature-*`: Smart Components. Páginas enrutables. Consumen el Store, no tienen estilos complejos.
- `/ui/*`: Dumb Components. 100% presentacionales. Reciben datos por `input()` y emiten eventos por `output()`. 

### 🛡️ REGLAS ESTRICTAS DE INMUTABILIDAD (ZERO-TOLERANCE)
1. **Inmutabilidad de Contratos (APIs):** PROHIBIDO modificar las interfaces del `/data-access/models` asumiendo que el backend cambiará. Los tipos TypeScript deben coincidir con la respuesta actual del backend.
2. **Preservación del Sistema de Diseño:** PROHIBIDO inventar clases CSS personalizadas o estilos en línea (`style="..."`). Debes ensamblar la vista utilizando EXCLUSIVAMENTE utilidades de Tailwind CSS y componentes de DaisyUI (`card`, `btn`, `badge`, etc.).
3. **Respeto de Estado:** Si modificas el `signalStore`, no rompas la inmutabilidad. Usa `patchState` correctamente y mantén la estructura de `rxMethod` para asincronía.
4. **Archivos de Traducción (i18n):** Si introduces textos nuevos en la UI, DEBES usar el pipe `translate` en el HTML y proporcionar al final de tu respuesta el bloque JSON con las llaves requeridas (ej. `"inventory.product.new_key": "Valor"`).
5. **Limpieza de Salida:** Añade como primera línea de cada bloque de código un comentario con la ruta exacta del archivo (ej. `// src/libs/products/feature-inventory-page/lib/...`). Devuelve el código completo sin truncar (`// ... resto del código`).

---

## 2. PLANTILLA FASE A: DIAGNÓSTICO FRONTEND
*Úsala para revisar un módulo (exportado con repomix) antes de que la IA genere código.*

implementa el codigo que te pasare, olvidate de los test y la compilacion, si hay traducciones realizalas en los dos
archivos de idiomas
**TAREA DE ANÁLISIS FRONTEND (FASE 1)**

A continuación, te proporcionaré el código del módulo frontend extraído con repomix. 
Tu objetivo es revisar este código buscando para implementar o mejorar específicamente: **[Elige uno: Fugas de memoria en suscripciones / Problemas de reactividad con Signals / Acoplamiento indebido en Dumb Components / Errores de UI o accesibilidad]**.

REGLAS DE EJECUCIÓN PARA ESTA FASE:
1. NO GENERES CÓDIGO HTML NI TYPESCRIPT COMPLETO.
2. SOLO REPORTE: Tu única salida debe ser un reporte estructurado.

FORMATO DEL REPORTE ESPERADO:
* Hallazgo #[N]: [Nombre del problema]
* Archivo Afectado: [Ruta del archivo]
* Impacto: [Bajo / Medio / Alto]
* Solución Propuesta: [Explicación técnica sin escribir el archivo completo]

Aquí está el código a analizar:
`[PEGAR OUTPUT DE REPOMIX AQUÍ]`

---

## 3. PLANTILLA FASE B: EJECUCIÓN FRONTEND
*Úsala para aprobar cambios y pasarlos a tu CLI.*

**EJECUCIÓN Y GENERACIÓN DE CÓDIGO FRONTEND (FASE 2)**

El análisis de la Fase 1 es correcto. 

INSTRUCCIÓN DE COMPILACIÓN:
Procede a implementar únicamente las soluciones aprobadas que te indico abajo. Respeta estrictamente las REGLAS DE INMUTABILIDAD compartidas en el Meta-Prompt (especialmente el uso de Tailwind, DaisyUI y Signals).

Puntos aprobados:
* [Especificar cuáles, ej. Implementar el Hallazgo #1 para limpiar el input() en el product-preview.component].

Entrégame:
1. Los archivos TypeScript/HTML modificados completos y limpios.
2. Si agregaste texto visible, el bloque JSON con las claves de traducción necesarias.