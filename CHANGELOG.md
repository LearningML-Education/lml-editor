# Changelog

Este archivo resume los cambios entre versiones taggeadas.
Formato basado en Keep a Changelog.

## [v2.0.0-beta14]

Rango: `v2.0.0-beta13..HEAD`

### Corregido
- La skill `release-manager` refleja el orden real del proceso de release: primero push de `main` y después creación y push de la tag.

### Commits destacados
- `4e7f4a0` Fix release manager skill flow

## [v2.0.0-beta13]

Rango: `v2.0.0-beta12..HEAD`

### Añadido
- Nueva skill `release-manager` para guiar el proceso de releases del repositorio.

### Cambiado
- Documentación y configuración de tests alineadas con la separación real entre Bun y Playwright.
- `.codex` y `test-results/` pasan a ignorarse en git para no interferir con el flujo de release.

### Corregido
- Renderizado de iconos Font Awesome migrado a dependencias locales sin depender de CDNs externos.
- Mayor robustez en la espera de entrenamiento E2E y en el comportamiento del comando `test:e2e`.

### Commits destacados
- `6c4909b` Fix E2E training wait robustness and align test:e2e CLI behavior
- `50ad32f` Migrate Font Awesome to local packages
- `c299355` Clarify test runner documentation
- `953e70d` Add release manager skill

## [v2.0.0-beta8] 

Rango: `v2.0.0-beta7..HEAD`

### Añadido
- Migración de la UI a Shadow DOM y ajuste del overlay de métricas del playground.
- Integración de Naive Bayes en modo avanzado y carga de teoría/ayuda desde markdown localizado.
- Nueva página avanzada de playground y mejoras de UX (clases, dataset, modo draw, controles).
- Métricas de entrenamiento ANN en playground.
- Baseline de tests con `bun:test` (unit/component/integration).
- Nuevos tests E2E para flujos de texto, imagen, números y datasets.

### Cambiado
- Migración de Node a Bun.
- Ajustes visuales de modal de aprendizaje y presentación del playground.
- Mejora de textos y traducciones en ayuda/theory.
- Ajustes de formularios y labels del playground.
- Separación/organización de suites de tests.

### Corregido
- Dropdown de `File` que se quedaba abierto.
- Estilos de contenido markdown de ayuda.
- Escala y leyenda en gráficas/matriz de confusión del entrenamiento.
- Renderizado de iconos Font Awesome dentro de Shadow DOM.
- Fallback de CPU en Chrome controlado por variable de entorno.

### Commits destacados
- `41493a1` Migrate UI to Shadow DOM and fix playground metrics overlay
- `84209dc` feat: integrate naive bayes in advanced mode and bridge
- `c92471e` feat: move playground to standalone advanced page
- `372f55d` Fix file menu dropdown getting stuck open
- `fc69319` Fix Font Awesome icons rendering inside Shadow DOM
- `5433de6` Add E2E tests for text, image, number, and dataset flows

## [v2.0.0-beta7]

Rango: `v2.0.0-beta4..v2.0.0-beta7`

### Cambiado
- Actualización de versión.
- Alta de tag/configuración de Google Analytics.

### Commits
- `12cac44` version
- `f499cdc` tag de google analytics

## [v2.0.0-beta4] 

Rango: `v2.0.0-beta3..v2.0.0-beta4`

### Cambiado
- Corrección de menús desplegados en móvil.
- Visualización del número de versión en el menú principal.

### Commits
- `93a9529` se arregla el problema de los menus que aparecían desplegados en versión móvil
- `a79dd18` se muestra el nº de versión en el menú principal

## [v2.0.0-beta3] 

Rango: `v2.0.0-beta2..v2.0.0-beta3`

### Cambiado
- Sin cambios funcionales respecto a `v2.0.0-beta2` (tags sobre el mismo estado de código).

## [v2.0.0-beta2] 

Rango: `v2.0.0-beta1..v2.0.0-beta2`

### Añadido
- Soporte de `BASE_URL` con `base href` configurable por variable de entorno.

### Commits
- `33c55f4` se añade base href="/loquesea/ usando la variable de entorno BASE_URL

## [v2.0.0-beta1] 

### Añadido
- Pipeline CI/CD.

### Commits
- `d0d8eb8` pipeline CI/CD
