# AGENTS.md

Guía operativa para agentes (Codex / Claude / etc.) que trabajen en este
repositorio.

------------------------------------------------------------------------

## 0) Objetivo del repo

Aplicación web construida con: - **Bun** como runtime/gestor de
paquetes/runner - **Lit** para componentes Web Components (Shadow DOM) -
ESM (import/export)

Este documento define cómo añadir código, cómo estructurar tests y qué
criterios de aceptación deben cumplirse en PRs.

------------------------------------------------------------------------

## 1) Principios de trabajo

1.  Cambios pequeños y verificables
    -   Un PR = un objetivo claro.\
    -   Evitar mezclar refactors con features.
2.  No inventar comportamiento
    -   Si el comportamiento no está definido en el código o docs,
        documentar supuestos en el PR.
3.  Determinismo
    -   Tests y builds deben ser reproducibles: sin depender de hora
        local, red real, APIs externas o estado del host.
4.  Compatibilidad
    -   ESM por defecto.\
    -   Evitar dependencias pesadas si no aportan valor claro.

------------------------------------------------------------------------

## 2) Estructura recomendada del repositorio

/src
  /assets
  /components
  /i18n
  /services
  /utils


/tests
  /unit
  /components
  /integration
  /e2e
  /helpers

los archivos de traducción en 

/xliff


------------------------------------------------------------------------

## 3) Convenciones de código (Lit)

### 3.1 Componentes

-   Definir propiedades con static properties o @property().
-   Emitir eventos con CustomEvent (bubbles: true, composed: true).
-   Usar Shadow DOM de forma consistente.

### 3.2 Eventos

-   Documentar nombre del evento y estructura de detail.

### 3.3 Async rendering

-   Tras cambiar props/atributos en tests o código, usar: await
    el.updateComplete

------------------------------------------------------------------------

## 4) Estrategia de tests (pirámide)

### 4.1 Unit tests (bun:test)

Para: 
- /src/utils/** 
- /src/state/** 
- lógica pura de /src/services/**

Reglas: 
- Testear comportamiento, no implementación. 
- Mockear solo dependencias externas (fetch, Date, crypto). 
- Cobertura objetivo: 80-90%

Ruta: tests/unit/**/*.test.js

------------------------------------------------------------------------

### 4.2 Component tests (DOM simulado)

Para: 
- render inicial 
- reactividad (props/attrs → rerender) 
- emisión de eventos 
- slots 
- accesibilidad básica

Reglas: 
- No testear CSS/layout. 
- Siempre usar await el.updateComplete tras cambios.

Ruta: tests/components/**/*.test.js

------------------------------------------------------------------------

### 4.3 Integration tests (Playwright + MSW)

Para: 

- integración entre componentes + servicios 
- estados loading/error/success 
- navegación básica 
- interacción real

Reglas: 

- No usar red real. 
- Preferir getByRole o data-testid frente a selectores frágiles.

Ruta: tests/integration/**/*.spec.js

------------------------------------------------------------------------

### 4.4 E2E (Playwright)

Para: - flujos críticos completos - smoke tests

Reglas: - Pocos pero representativos. - Ejecutar contra build real o dev
server controlado.

Ruta: tests/e2e/\*\*/\*.spec.ts

------------------------------------------------------------------------

## 5) Criterios de aceptación

Un PR es aceptable si:

1.  Incluye tests adecuados.
2.  bun test pasa.
3.  Playwright (si aplica) pasa.
4.  No introduce flakiness.
5.  No depende de red real.

------------------------------------------------------------------------

## 6) Orden recomendado para agentes

1.  Enumerar casos de prueba (unit / component / integration / e2e).
2.  Implementar unit tests.
3.  Implementar component tests.
4.  Añadir integration si aplica.
5.  Añadir E2E solo si es flujo crítico.

------------------------------------------------------------------------

## 7) Anti‑patrones

-   Testear clases CSS o layout en unit/component.
-   Selectores frágiles del Shadow DOM.
-   Mockear el propio módulo bajo test.
-   Tests sin assertions fuertes.

------------------------------------------------------------------------