# NgRx

## Estado de la aplicación

El estado son los datos que son importantes para la aplicación y que influyen en qué se verá en la pantalla.
Todos los datos que controlan que será visible en la pantalla.

## ¿Qué es NgRx?
Redux es un patrón de gestión del estado de la aplicación.

La idea de manejar el estado con Redux es tener un **Store** central de toda la aplicación que mantiene el estado de la misma.

El **Store** es un objeto de javascript que contiene todos los datos que necesitan las diferentes partes de la aplicación.

Los servicios y los componentes pueden seguir interactuando, pero reciben el estado de este **Store**.

Por lo que el **Store** es la única fuente de verdad (single source of truth) que gestiona el estado de la aplicación.

No sólamente reciben el estado, también pueden modificarlo (al agregar un elemento o modificarlo), para ello se utilizan las **Actions** (dispatch **Action**).

Un **Action** es un objeto de javascript que contiene un **identificador** (el tipo de acción que se desea realizar) y opcionalmente un **payload** (los datos que se van a agregar o modificar).

Los **Actions** no llegan directamente al **Store**, si no que usan **Reducers**.

Los **Reducers** son funciones que obtiene el estado actual que está almacenado en el **Store** y el **Action**, y luego ejecuta código en el **Store** que también se le pasa como argumento y modifica el estado de manera inmutable, copiándolo y después modificando la copia, devolviendo un nuevo estado.

**NgRx** es una implementación de Angular del patrón Redux, pero con varias diferencias o cosas específicas de Angular:

**Diferencias**:
    - Está completamente integrado en Angular: Viene con servicios inyectables, por lo que puedes acceder fácilmente al **Store** en cualquier parte de la aplicación simplemente inyectándolo.
    - Usa RxJs: Emplea **Observables**. Todo el estado se gestiona como un gran **Observable**.
    - Soporta Typescript.

## Effects

Un side effect es una parte de la aplicación que contiene lógica que es importante para la aplicación pero no tan importante para actualizar inmediatamente el estado de la aplicación.

El resultado de estas acciones sí que tiene que ser actualizado en el estado, pero el proceso en sí no.

Side effects por ejemplo puede ser una petición http, en la que guardaremos el resultado en el estado, pero el proceso de la petición no habría que guardarlo, a parte de que en los reducers no se puede usar código asíncrono.

Otro side effect puede ser acceder o escribir datos en el `localStorage`.

Para controlar estos side effects, NgRx tiene un paquete llamado Effects que tiene que ser instalado a parte.

Este paquete nos da herramientas para poder trabajar con estos side effects entre las acciones que enviamos y recibimos para mantener los reducers limpios y tener un lugar para poder gestionarlos.