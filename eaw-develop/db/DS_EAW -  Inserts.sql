USE `DS_EAW`;

-- Reset tables ids
ALTER TABLE `DS_EAW`.`AutomaticDescriptions` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`AutomaticEvaluatorPages` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Browsers` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Clients` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Countries` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Criterions` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Devices` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Disabilities` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`ErrorDebugs` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Evaluations` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Findings` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Guidelines` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Languages` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`ManualAnswers` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`ManualPages` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Notices` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Notifications` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`OperativeSystems` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Packages` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Pages` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Principles` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Recommendations` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Reports` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`RoleTypes` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Rules` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Segments` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Specifications` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`SupportTools` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Tags` AUTO_INCREMENT = 1;
ALTER TABLE `DS_EAW`.`Users` AUTO_INCREMENT = 1;

INSERT INTO DS_EAW.AutomaticDescriptions (`codeSnifferCode`, `description`) VALUES
('1_1_1.H30.2', 'El elemento Img no contiene texto alternativo. La etiqueta alt debe describir el propósito del enlace.'),
('1_1_1.H37', 'El elemento Img no tiene el atributo alt. Use el atributo alt para especificar una alternativa de texto breve'),
('1_1_1.H67.1', 'El elemento Img presenta texto alternativo vacío, además el atributo títle está ausente o vacío.'),
('1_1_1.H67.2', 'El elemento Img está marcado para que la tecnología de asistencia lo ignore.'),
('1_1_1.G94.Image', 'Asegúrese de que el texto alternativo del elemento img tenga el mismo propósito y presente la misma información que la imagen'),
('1_1_1.H36', 'A la imagen del botón submit le falta un atributo alt. Especifique una alternativa de texto que describa la función del botón, utilizando el atributo alt'),
('1_1_1.G94.Button', 'Asegúrese de que el texto alternativo de la imagen del botón submit identifica el propósito del botón.'),
('1_1_1.H24', 'Al elemento de área en la imagen mapa le falta un atributo alt. Use el atributo alt para describir el área en el mapa.'),
('1_1_1.H24.2', 'Asegúrese de que la alternativa de texto del elemento de área en el mapa tenga el mismo propósito que la parte de la imagen del mapa a la que hace referencia.'),
('1_1_1.G73,G74', 'Si esta imagen no se puede describir completamente en una alternativa de texto corto, asegúrese de que también esté disponible una alternativa de texto largo, ya sea en con texto en el body o mediante un enlace.'),
('1_1_1.H2.EG5', 'El elemento Img dentro de un enlace no debe ser el mismo que el texto del enlace. Considere combinar la descripción de la imagen con el enlace.'),
('1_1_1.H2.EG4', 'El elemento Img dentro de un enlace tiene texto alternativo vacío o faltante. Considere combinar el texto del enlace con la descripción de la imagen.'),
('1_1_1.H2.EG3', 'El elemento Img dentro de un enlace no debe usar texto alternativo que duplique el contenido de un enlace de texto junto a él.'),
('1_1_1.H53', 'Los elementos Object deben contener una alternativa de texto después de que se hayan agotado todas las demás alternativas.'),
('1_1_1.G94,G92.Object', 'Verifique que las alternativas de texto estén disponibles para contenido que no sea de texto y que tengan el mismo propósito y presenten la misma información.'),
('1_1_1.H35.3', 'Los elementos applet deben contener una alternativa de texto en el cuerpo del elemento, para navegadores sin soporte para el elemento applet.'),
('1_1_1.H35.2', 'Los elementos del applet deben contener un atributo alt, para proporcionar una alternativa de texto a los navegadores que admiten el elemento pero no pueden cargar el applet.'),
('1_1_1.G94,G92.Applet', 'Verifique que las alternativas de texto estén disponibles para contenido que no sea de texto y que tengan el mismo propósito y presenten la misma información.'),
('1_2_1.G158', 'Si este objeto incrustado contiene audio pregrabado verifique que haya disponible una versión alternativa de texto.'),
('1_2_1.G159,G166', 'Si este objeto incrustado contiene video pregrabado, verifique que esté disponible una versión alternativa de texto o que se proporcione una pista de audio que presente información equivalente.'),
('1_2_2.G87,G93', 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcionen subtítulos para el contenido de audio.'),
('1_2_3.G69,G78,G173,G8', 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una descripción de audio de su video y / o una versión alternativa de texto del contenido.'),
('1_2_4.G9,G87,G93', 'Si este objeto incrustado contiene medios sincronizados, verifique que se proporcionen subtítulos para el contenido de audio en vivo.'),
('1_2_5.G78,G173,G8', 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una descripción de audio para su contenido de video.'),
('1_2_6.G54,G81', 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una interpretación del lenguaje de señas para su audio.'),
('1_2_7.G8', 'Si este objeto incrustado contiene medios sincronizados, y cuando las pausas en el audio en primer plano no son suficientes para permitir que las descripciones de audio transmitan la sensación de video pregrabado, verifique que se proporcione una descripción de audio extendida, ya sea a través de secuencias de comandos o una versión alternativa.'),
('1_2_8.G69,G159', 'Si este objeto incrustado contiene medios sincronizados pregrabados o contenido solo de video, verifique que se proporcione una versión alternativa de texto del contenido.'),
('1_2_9.G150,G151,G157', 'Si este objeto incrustado contiene contenido de solo audio en vivo, verifique que se proporcione una versión de texto alternativa del contenido.'),
('1_3_1.H42.2', 'Etiqueta de encabezado encontrada sin contenido. Se debe especificar un encabezado, no pretender que texto sin etiquetas de encabezados representen un encabezado. '),
('1_3_1.H93', 'Existen varias etiquetas con el mismo atributo "for". Si estas etiquetas se refieren a diferentes controles (input, textarea, ...,) de formulario, los controles deben tener atributos únicos de "id".'),
('1_3_1.H44.NonExistent', 'El atributo "for" de esta etiqueta contiene un id que no existe en el documento.'),
('1_3_1.H44.NonExistentFragment', 'El atributo "for" de esta etiqueta contiene un id que no existe en el fragmento de documento.'),
('1_3_1.H44.NotFormControl', 'El atributo "for" de esta etiqueta contiene un id que apunta a un elemento que no es un control (input, textarea, ...,) de formulario.'),
('1_3_1.H44.NoForAttr', 'Etiqueta encontrada sin un atributo "for" y, por lo tanto, no está explícitamente asociada con un control (input, textarea, ...,) de formulario.'),
('1_3_1.H44.NoId', 'El control de formulario no tiene un id, por lo tanto, no puede tener una etiqueta explícita.'),
('1_3_1.H65.3', 'El control de formulario sin etiqueta contiene un atributo title vacío. El atributo de title debe identificar el propósito del control.'),
('1_3_1.H65', 'Compruebe que el atributo title identifica el propósito del control y que un elemento de etiqueta no es apropiado.'),
('1_3_1.H44.2', 'El control del form (input, textarea...) no tiene una etiqueta explícita o título de atributo que identifique el propósito del dicho controlador.'),
('1_3_1.H44.NoLabelAllowed', 'Uno de los controles del form no debería tener una etiqueta explícita. Se recomienda revisar los botones, ya que cuentan con su propia etiqueta, y elementos ocultos. '),
('1_3_1.H44.1.After', 'La etiqueta para el elemento de control del form debería colocarse después de este elemento. Se recomienda revisar radio botones y entradas de tipo "checkbox".'),
('1_3_1.H44.1.Before', 'La etiqueta para el elemento de control del form debería colocarse antes de este elemento. Se recomienda revisar entradas de texto ("text", "textarea", "password", ...).'),
('1_3_1.H49.[NodeName]', 'Revise que el "marcado semántico" de HTML ("em", "strong", "cite"...) se utiliza para enfatizar texto especial y pueda ser identificado programáticamente.'),
('1_3_1.H49.AlignAttr', 'Revise que el "marcado semántico" de HTML se utiliza para enfatizar texto. Ejemplo: utilizar "text-align" en párrafos y otros tipos de textos. '),
('1_3_1.H42', 'Revise si el elemento es un encabezado, si lo es, debe usar el marcado HTML de encabezados (h1, h2, ...).'),
('1_3_1.H63.3', 'La celda de la tabla no posee un atributo de alcance válido ("row", "col", "rowgroup", "colgroup").'),
('1_3_1.H63.2', 'Los elementos "td" en las tablas se encuentran obsoletos, se recomienda utilizar elementos "th" en su lugar.'),
('1_3_1.H43.ScopeAmbiguous', 'Revise si los atributos son ambiguos en una tabla con múltiples niveles de encabezados. Se recomienda usar atributos encabezados en elementos "td" en su lugar.'),
('1_3_1.H43.IncorrectAttr', 'El elemento "td" con un atributo de encabezado no coincide con el esperado de sus celdas de encabezado correspondientes.'),
('1_3_1.H43.HeadersRequired', 'La relación entre elementos "td" y el elemento "th" asociado no está definida. Si una tabla tiene variedad de niveles de elementos "th", se deben utilizar atributos de encabezado en elementos td.'),
('1_3_1.H43.MissingHeaderIds', 'No todos los elementos de esta tabla contienen un atributo "id". Estas celdas deben contener identificadores para que puedan ser referenciados por los atributos de encabezados de elementos "td".'),
('1_3_1.H43.MissingHeadersAttrs', 'No todos los elementos "td" en esta tabla contienen un atributo de encabezado. Se recomienda que cada atributo de encabezado debe enumerar los identificadores de todos los elementos "th" asociados con esa celda.'),
('1_3_1.H43,H63', 'La relación entre los elementos "td" y sus elementos "th" asociados no está definida. Utilice el atributo de alcance en los elementos "th" o el atributo de encabezado en los elementos "td".'),
('1_3_1.H63.1', 'No todos los elementos de esta tabla tienen un atributo de alcance. Estas celdas deben contener un atributo de alcance para identificar su asociación con elementos td.'),
('1_3_1.H39,H73.4', 'Si esta tabla es una tabla de datos, y presenta un atributo de resumen y un elmento de subtítulo, el resumen no debe ser igual que el subtítulo.'),
('1_3_1.H73.3.Check', 'Si esta tabla es una tabla de datos, verifique que el atributo de resumen describe la organización de las tablas o explica cómo usar la tabla.'),
('1_3_1.H73.3.NoSummary', 'Si esta tabla es una tabla de datos, considere usar el atributo de resumen del elemento de la tabla para obtener una visión general de esta tabla.'),
('1_3_1.H39.3.Check', 'Si la tabla es una tabla de datos, revise si el elemento describe la tabla acertadamente.'),
('1_3_1.H39.3.NoCaption', 'Si la tabla es una tabla de datos, se recomienda colocar un subtítulo o "caption" en el elemento tabla para identificar esta tabla.'),
('1_3_1.H71.3', 'El conjunto de campos no contiene un elemento de leyenda. Todos los conjuntos de campos deben contener un elemento de leyenda que describa una descripción del grupo de campos.'),
('1_3_1.H85.2', 'Si esta lista de selección contiene grupos de opciones relacionadas, deben agruparse con la etiqueta HTML "optgroup".'),
('1_3_1.H71.2', 'Los botones de radio o casillas de verificación con el mismo atributo de nombre deben estar contenidos dentro de un elemento HTML "fieldset".'),
('1_3_1.H48.1', 'El contenido parece tener la apariencia visual de una lista con viñetas. Puede ser apropiado marcar este contenido usando un elemento "ul".'),
('1_3_1.H48.2', 'El contenido parece tener la apariencia visual de una lista numerada. Puede ser apropiado marcar este contenido usando un elemento "ol".'),
('1_3_1.G141', 'Los encabezados no cumplen un orden lógico. Se recomienda que el encabezado primario sea un "h1" y de la misma forma seguir el orden lógico sin saltar numeraciones.'),
('1_3_1.H48', 'Si este elemento contiene una sección de navegación, se recomienda que se marque como una lista.'),
('1_3_2.G57', 'Compruebe que el contenido se ordena en una secuencia significativa cuando se linealiza, como cuando las hojas de estilo están deshabilitadas.'),
('1_3_3.G96', 'Cuando se proporcionan instrucciones para comprender el contenido, no confíe solo en las características sensoriales (como la forma, el tamaño o la ubicación) para describir los objetos.'),
('1_4_1.G14,G182', 'Verifique que cualquier información transmitida usando solo color también esté disponible en texto o mediante otras señales visuales.'),
('1_4_2.F23', 'Si algún audio se reproduce automáticamente durante más de 3 segundos, compruebe que existe la posibilidad de pausar, detener o silenciar el audio.'),
('1_4_3.G18', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1; para textos grandes, se espera la que sea de al menos 3:1; se excluye de la regla el texto en logotipos y textos o imagenes que sean simple decoración.'),
('1_4_3.G145', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 3: 1; se excluye de la regla el texto en logotipos y textos o imagenes que sean simple decoración.'),
('1_4_3.F24.BGColour', 'Compruebe que este elemento tenga un color de primer plano heredado para complementar el color de fondo o imagen de fondo correspondiente.'),
('1_4_3.F24.FGColour', 'Compruebe que este elemento tenga un color de fondo heredado para complementar el color o imagen de primer plano correspondiente.'),
('1_4_4.G142', 'Compruebe que el texto se puede cambiar de tamaño sin tecnología de asistencia hasta un 200 por ciento sin pérdida de contenido o funcionalidad.'),
('1_4_5.G140,C22,C30.AALevel', 'Si las tecnologías que se usan pueden lograr la presentación visual, verifique que el texto se use para transmitir información en lugar de imágenes de texto, excepto cuando la imagen de texto es esencial para la información que se transmite o puede personalizarse visualmente según los requisitos del usuario.'),
('1_4_6.G17', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 7: 1.'),
('1_4_6.G18', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'),
('1_4_7.G56', 'Si hay contenido de audio pregrabado que es principalmente el habla (como la narración), los sonidos de fondo deben ser mutables, o ser al menos 20 dB (Aproximadamente 4 veces más silenciosos) que el habla.'),
('1_4_8.G148,G156,G175', 'Verifique que haya un mecanismo disponible para que el usuario seleccione los colores de primer plano y de fondo para los bloques de texto, ya sea a través de la página web o del navegador.'),
('1_4_8.H87,C20', 'Compruebe que existe un mecanismo para reducir el ancho de un bloque de texto a no más de 80 caracteres (o 40 en escritura china, japonesa o coreana).'),
('1_4_8.C19,G172,G169', 'Verifique que los bloques de texto no estén completamente justificados, es decir, en los bordes izquierdo y derecho, o que exista un mecanismo para eliminar la justificación completa.'),
('1_4_8.G188,C21', 'Verifique que el espaciado entre líneas en bloques de texto sea al menos 150 por ciento en los párrafos, y que el espaciado entre párrafos sea al menos 1.5 veces el espaciado entre líneas, o que haya un mecanismo disponible para lograr esto.'),
('1_4_8.H87,G146,C26', 'Compruebe que el texto se puede cambiar de tamaño sin tecnología de asistencia hasta un 200 por ciento sin requerir que el usuario se desplace horizontalmente en una ventana de pantalla completa.'),
('1_4_9.G140,C22,C30.NoException', 'Compruebe que las imágenes de texto solo se usan para decoración pura o donde una presentación particular de texto es esencial para la información que se transmite.'),
('2_1_1.SCR20.DblClick', 'Revise que la funcionalidad "doble click" y eventos del ratón estén disponibles a través del teclado.'),
('2_1_1.SCR20.MouseOver', 'Revise que la funcionalidad "mouse encima" (evento "focus") y eventos del ratón estén disponibles a través del teclado.'),
('2_1_1.SCR20.MouseOut', 'Revise que la funcionalidad "mouse afuera" (evento "unFocus") y eventos del ratón estén disponibles a través del teclado.'),
('2_1_1.SCR20.MouseMove', 'Revise que la funcionalidad "mouse sobre" (evento "hover") y eventos del ratón estén disponibles a través del teclado.'),
('2_1_1.SCR20.MouseDown', 'Revise que la funcionalidad "mantener click" y eventos del ratón estén disponibles a través del teclado.'),
('2_1_1.SCR20.MouseUp', 'Revise que la funcionalidad "soltar el click luego de presionar" y eventos del ratón estén disponibles a través del teclado.'),
('2_1_2.F10', 'Compruebe que este applet o complemento proporciona la capacidad de alejar el foco de sí mismo cuando usa el teclado.'),
('2_2_1.F40.2', 'Meta etiqueta de actualización utilizada para redirigir a otra página, con un límite de tiempo que no es cero. Se recomienda que no se creen cambios de contexto que pueden interrumpir al usuario. Es aceptable utilizar el "meta" elemento si el tiempo de espera para redireccionar es de 0 segundos. '),
('2_2_1.F41.2', 'Si hay una "meta" etiqueta de actualización utilizada para actualizar la página actual. Los usuarios no pueden controlar el límite de tiempo para esta actualización. Se recomienda evitar que la página se refresque inesperadamente.'),
('2_2_2.SCR33,SCR22,G187,G152,G186,G191', 'Si alguna parte del contenido se mueve, se desplaza o parpadea durante más de 5 segundos, o se actualiza automáticamente, verifique que haya un mecanismo disponible para pausar, detener u ocultar el contenido.'),
('2_2_2.F4', 'Asegúrese de que haya un mecanismo disponible para detener este elemento parpadeante en menos de cinco segundos.'),
('2_2_2.F47', 'Los elementos de parpadeo no pueden satisfacer el requisito de que la información de parpadeo se pueda detener en cinco segundos.'),
('2_2_3.G5', 'Verifique que el tiempo no sea una parte esencial del evento o actividad presentada por el contenido, a excepción de los medios sincronizados no interactivos y los eventos en tiempo real.'),
('2_2_4.SCR14', 'Verifique que el usuario pueda posponer o quitar todas las interrupciones (incluidas las actualizaciones de contenido), a exlas interrupciones que involucren una emergencia.'),
('2_2_5.G105,G181', 'Si la página web es parte de un conjunto de páginas web con un límite de tiempo de inactividad, verifique que un usuario autenticado pueda continuar la actividad sin pérdida de datos después de volver a autenticarse.'),
('2_3_1.G19,G176', 'Verifique que ningún componente del contenido tenga un destello de más de tres veces en un período de 1 segundo, o que el tamaño de cualquier área de destello sea lo suficientemente pequeño.'),
('2_3_2.G19', 'Compruebe que ningún componente del contenido destelle más de tres veces en un período de 1 segundo.'),
('2_4_1.H64.1', 'El elemento "iframe" requiere un atributo de título no vacío que identifica el "frame".'),
('2_4_1.H64.2', 'Compruebe que el atributo título (title) de este elemento contiene texto que identifica el "frame".'),
('2_4_1.G1,G123,G124,H69', 'Asegúrese de que cualquier elemento de navegación común se pueda omitir; por ejemplo, mediante el uso de enlaces de omisión, elementos de encabezado o roles de referencia de ARIA.'),
('2_4_1.G1,G123,G124.NoSuchID', 'Este enlace apunta a un ancla con un nombre dentro del documento, pero no existe un ancla con ese nombre.'),
('2_4_1.G1,G123,G124.NoSuchIDFragment', 'Este enlace apunta a un ancla con un nombre dentro del documento, pero no existe un ancla con ese nombre en el fragmento.'),
('2_4_2.H25.1.NoTitleEl', 'Se debe proporcionar un título para el documento, utilizando un elemento de título no vacío en la sección de encabezado.'),
('2_4_2.H25.1.EmptyTitle', 'El elemento de título en la sección de encabezado no debe estar vacío.'),
('2_4_2.H25.2', 'Compruebe que el elemento del título describe el documento.'),
('2_4_3.H4.2', 'Si se usa "tabindex", verifique que el orden de tabulación especificado por los atributos del "tabindex" siga las relaciones en el contenido.'),
('2_4_4.H77,H78,H79,H80,H81,H33', 'Verifique que el texto del enlace combinado con el contexto del enlace determinado mediante programación, o su atributo de título, identifique el propósito del enlace.'),
('2_4_4.H77,H78,H79,H80,H81', 'Compruebe que el texto del enlace combinado con el contexto del enlace determinado mediante programación identifica el propósito del enlace.'),
('2_4_5.G125,G64,G63,G161,G126,G185', 'Si esta página web no es parte de un proceso lineal, verifique que haya más de una forma de ubicar esta página web dentro de un conjunto de páginas web.'),
('2_4_6.G130,G131', 'Verifique que los títulos y las etiquetas describan el tema o el propósito.'),
('2_4_7.G149,G165,G195,C15,SCR31', 'Verifique que haya al menos un modo de operación donde el indicador de enfoque del teclado pueda ubicarse visualmente en los controles de la interfaz de usuario.'),
('2_4_8.H59.1', 'Los elementos de enlace solo pueden ubicarse en la sección del encabezado del documento.'),
('2_4_8.H59.2a', 'Al elemento de enlace le falta el atributo "rel" no vacío que identifica el tipo de enlace.'),
('2_4_8.H59.2b', 'Al elemento de enlace le falta el atributo "href" no vacío que apunta al recurso que se está vinculando.'),
('2_4_9.H30', 'Revise que el texto del enlace describa el propósito del enlace.'),
('3_1_1.H57.2', 'El HTML debe tener un atributo "lang" o "xml: lang" que describa el idioma del documento.'),
('3_1_1.H57.3.Lang', 'El lenguaje especificado en el atributo "lang" del elemento del documento no parece estar bien formado. Ejemplos aceptados son: "es", "en" y otros.'),
('3_1_1.H57.3.XmlLang', 'El lenguaje especificado en el atributo "xml: lang" del elemento del documento no parece estar bien formado. Ejemplos aceptados son: "es", "en" y otros.'),
('3_1_2.H58', 'Asegúrese de que cualquier cambio en el idioma esté marcado con el atributo "lang" o "xml: lang", según corresponda.'),
('3_1_2.H58.1.Lang', 'El lenguaje especificado en el atributo "xml: lang" no parece bien formado. Ejemplo aceptado: lang="es"'),
('3_1_2.H58.1.XmlLang', 'El lenguaje especificado en el atributo "xml: lang" no parece bien formado. Ejemplo aceptado: xml:lang="es"'),
('3_1_3.H40,H54,H60,G62,G70', 'Revise que haya un mecanismo para acceder a definiciones de palabras inusuales, palabras restringidas, modismos y jerga. '),
('3_1_4.G102,G55,G62,H28,G97', 'Revise que sea posible acceder a la forma expandida o significado de las abreviaciones. '),
('3_1_5.G86,G103,G79,G153,G160', 'Cuando el contenido requiere capacidad de lectura más avanzada que el nivel de educación secundaria inferior (en Costa Rica, primeros años de colegio), se debe proporcionar contenido complementario o una versión alternativa.'),
('3_1_6.H62.1.HTML5', 'El elemento Ruby no contiene un elemento rt con información de pronunciación para el texto del cuerpo.'),
('3_1_6.H62.1.XHTML11', 'El elemento Ruby no contiene un elemento rt con información de pronunciación para el texto dentro del elemento rb.'),
('3_1_6.H62.2', 'El elemento "ruby" no contiene elementos rp, los cuales mejoran el formato de caracteres para navgadores que no soportan el texto tipo "ruby".'),
('3_2_1.G107', 'Compruebe que no se produce un cambio de contexto cuando cualquier campo de entrada recibe el foco.'),
('3_2_2.H32.2', 'El form no contiene un botón para enviar la información. Recomendación: Colocar el atributo "input type" con el valor "submit" o "image" o un botón de tipo "submit".'),
('3_2_3.G61', 'Compruebe que los mecanismos de navegación que se repiten en varias páginas web se producen en el mismo orden relativo cada vez que se repiten, a menos que el usuario inicie un cambio.'),
('3_2_4.G197', 'Verifique que los componentes que tienen la misma funcionalidad dentro de esta página web se identifiquen consistentemente en el conjunto de páginas web a las que pertenece.'),
('3_2_5.H83.3', 'Compruebe que si un enlace se abrirá en una ventana nueva, este contiene información que indique dicha acción.'),
('3_3_1.G83,G84,G85', 'Revise que si se detecta un error de entrada en el formulario, este error sea descrito para el usuario en texto.'),
('3_3_2.G131,G89,G184,H90', 'Compruebe que se proporcionan etiquetas o instrucciones descriptivas (incluidos los campos obligatorios) para la entrada del usuario en este formulario.'),
('3_3_3.G177', 'Compruebe que este formulario sugiere correcciones a los errores en la entrada del usuario, a menos que ponga en peligro la seguridad o el propósito del contenido.'),
('3_3_4.G98,G99,G155,G164,G168.LegalForms', 'Si este formulario obliga a un usuario a un compromiso legal, modificaría o eliminaría datos controlables por el usuario o enviaría respuestas de prueba, asegúrese de que los envíos sean reversibles, verificados por errores de entrada y / o confirmados por el usuario.'),
('3_3_5.G71,G184,G193', 'Verifique que la ayuda contextual esté disponible para este formulario, a nivel de página web o haya un mecanismo de control.'),
('3_3_6.G98,G99,G155,G164,G168.AllForms', 'Revise que los envios de datos al formulario sean reversibles, controlados por errores en entradas, y confirmados por el usuario. '),
('4_1_1.F77', 'El valor del id de el elemento se encuentra duplicado.'),
('4_1_2.H91.A.Empty', 'Elemento de anclaje "a" que contiene un ID pero sin un "href" o texto de enlace, considere mover dicho ID a un elemento primario o cercano, sino, se evita el rol elemento cumpla su rol de enlace. Lo anterior no aplica en la version 4.01 de HTML (Lenguaje de Marcas de Hipertexto). '),
('4_1_2.H91.A.EmptyWithName', 'Elemento de anclaje "a" tiene un atributo de nombre, pero sin "href" o texto de enlace. Considere mover el atributo de nombre para convertirse en un ID de un elemento primario o cercano.'),
('4_1_2.H91.A.EmptyNoId', 'Se encuentra un elemento de anclaje "a" sin contenido de tipo link, nombre y atributo ID.'),
('4_1_2.H91.A.NoHref', 'Los elementos de anclaje que no deberían ser usados para definir objetivos de enlace en la página, excepto si se utiliza el ID para otros fines (como CSS o secuencias de comandos), considere moverl el ID a un elemento principal.'),
('4_1_2.H91.A.Placeholder', 'Se encuentra un elemento de anclaje que tiene contenido de tipo link, pero sin "href" y o atributo ID.'),
('4_1_2.H91.A.NoContent', 'Se encuentra un elemento de anclaje que tiene un atributo "href" válido, pero sin contenido de enlace.'),
('4_1_2.H91.[NodeName].Name', 'El elemento no tiene un nombre disponible para una API de accesibilidad. Reomendaciones: "alt" y "title" para imágenes, texto dentro del marcado "button", elemento asociado a un atrinuto "title", atributos "aria-label" o "aria-labelledby" para entradas de texto, texto dentro de un atributo "fieldset" y el atributo "value" en botones.'),
('4_1_2.H91.[NodeName].Value', 'El elemento no tiene un valor disponible para una API de accesibilidad. Recomendaciones: Atributo "href" para elementos "a", "value" para entradas de texto, texto dentro de elmentos "textarea", asignar el atributo "option" del elemento "select". '),
('1_3_1.F92', 'El rol de este elemento es "presentation" pero contiene elementos secundarios con significado semántico. Compruebe si el elemento transmite información, estructura o relaciones a través del marcado semántico.'),
('1_3_1.F68.Hidden', 'Este campo de formulario oculto está etiquetado de alguna manera. No debería haber necesidad de etiquetar un campo de formulario oculto.'),
('1_3_1.F68.HiddenAttr', 'Este campo de formulario está destinado a estar oculto (utilizando el atributo "hidden", pero también está etiquetado de alguna manera. No debería haber necesidad de etiquetar un campo de formulario oculto.'),
('1_3_1.F68', 'Este campo de formulario debe estar etiquetado de alguna manera. Utilice el elemento de etiqueta (ya sea con un atributo "for" o encapsulado en un form field), o los atributos "title", "aria-label" o "aria-labelledby" según corresponda.'),
('1_3_1.H73.3.LayoutTable', 'Parece que esta tabla se usa para el diseño, pero contiene un atributo de summary. Las tablas de diseño no deben contener atributos summary o, si se proporcionan, deben estar vacías.'),
('1_3_1.H39.3.LayoutTable', 'Parece que esta tabla se usa para el diseño, pero contiene un elemento caption. Las tablas de diseño no deben contener captions.'),
('1_3_1.H71.NoLegend', 'El fieldset no contiene un elemento de leyend. Todos los fieldsets deben contener un elemento de leyend que describa el grupo de campos.'),
('1_3_1.H71.SameName', 'Si estos botones de radio o casillas de verificación requieren una descripción adicional a nivel de grupo, deben estar contenidos dentro de un elemento fieldset.'),
('1_3_1_A.G141', 'La estructura del encabezado no está lógicamente anidada. Utilice la jerarquía apropiada en los encabezados.'),
('1_3_1_AA.G141', 'La estructura del encabezado no está lógicamente anidada. Utilice la jerarquía apropiada en los encabezados.'),
('1_3_1_AAA.G141', 'La estructura del encabezado no está lógicamente anidada. Utilice la jerarquía apropiada en los encabezados.'),
('1_3_1.LayoutTable', 'Esta tabla parece ser una tabla de diseño. Si se pretende que sea una tabla de datos, asegúrese de que las celdas de encabezado se identifiquen utilizando los elementos th.'),
('1_3_1.DataTable', 'Esta tabla parece ser una tabla de datos. Si se pretende que sea una tabla de diseño, asegúrese de que no haya elementos th, ni resumen o título.'),
('1_4_1.G14,G18', 'Verifique que cualquier información transmitida usando solo el color también esté disponible en el texto, o mediante otras indicaciones visuales.'),
('1_4_3.G18.Alpha', 'El texto o el fondo de este elemento contiene transparencia. Asegúrese de que la relación de contraste entre el texto y el fondo sea de al menos 4.5: 1.'),
('1_4_3.G145.Alpha', 'El texto o el fondo de este elemento contiene transparencia. Asegúrese de que la relación de contraste entre el texto y el fondo sea de al menos 4.5: 1.'),
('1_4_3.G18.Abs', 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sea de al menos 4.5: 1.'),
('1_4_3.G145.Abs', 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sean de al menos 3: 1.'),
('1_4_3.G18.BgImage', 'El texto de este elemento se coloca en una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sea de al menos 4.5: 1.'),
('1_4_3.G145.BgImage', 'El texto de este elemento se coloca sobre una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'),
('1_4_3.G18.Fail', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'),
('1_4_3.G145.Fail', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'),
('1_4_6.G17.Abs', 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sean de al menos 3: 1.'),
('1_4_6.G18.Abs', 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sean de al menos 3: 1.'),
('1_4_6.G17.BgImage', 'El texto de este elemento se coloca sobre una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'),
('1_4_6.G18.BgImage', 'El texto de este elemento se coloca sobre una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'),
('1_4_6.G17.Fail', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'),
('1_4_6.G18.Fail', 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'),
('2_1_1.G90', 'Asegúrese de que la funcionalidad proporcionada por un controlador de eventos para este elemento esté disponible a través del teclado'),
('2_4_1.G1,G123,G124.NoSuchIDFragment', 'Este enlace apunta a un ancla dentro del documento, pero no existe esta ancla.'),
('2_4_2.H25.1.NoHeadEl', 'No hay una sección de cabecera en la cual colocar un elemento de título descriptivo.'),
('3_1_2.H58.1.Lang', 'El idioma especificado en el atributo lang de este elemento no parece estar bien formado.'),
('3_1_2.H58.1.XmlLang', 'El lenguaje especificado en el atributo xml: lang de este elemento no parece estar bien formado.'),
('4_1_2.H91.A.EmptyWithName', 'Elemento de anclaje encontrado con un atributo de nombre pero sin href o texto de enlace. Considere mover el atributo name para convertirse en una ID de un elemento primario o cercano.'),
('4_1_2.H91.A.EmptyNoId', 'Elemento de anclaje encontrado sin contenido de enlace y sin nombre y / o atributo ID.'),
('1_3_4.RestrictView', 'Confirme que el contenido no restringe su vista y o funcionamiento en una orientación, sea vertical u horizontal, a menos que una orientación de visualización específica sea esencial.'),
('1_3_5.H98.FaultyValue', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento podría tener un fallo potencial en el valor de autocompletado.'),
('1_3_5.H98.InvalidAutocomplete_Text', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de texto.'),
('1_3_5.H98.InvalidAutocomplete_Multiline', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de multilinea.'),
('1_3_5.H98.InvalidAutocomplete_Password','Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de contraseñas.'),
('1_3_5.H98.InvalidAutocomplete_Url', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de URL.'),
('1_3_5.H98.InvalidAutocomplete_Telephone', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de teléfonos.'),
('1_3_5.H98.InvalidAutocomplete_Numeric', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control numérico'),
('1_3_5.H98.InvalidAutocomplete_Month', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de Meses "Month"'),
('1_3_5.H98.InvalidAutocomplete_Date', 'Confirme que un elemento "input", "select", o área de texto que realice el autocompletado. Este elemento no tiene un valor de autocompletado válido para el grupo de control de fechas'),
('1_3_5.H98.Purpose', 'Compruebe que el campo de entrada cumple un propósito identificado en la sección Propósitos de entrada para componentes de interfaz de usuario; y que el contenido se implementa utilizando tecnologías con soporte para identificar el significado esperado para los datos de entrada de formulario.'),
('1_3_5.H98.MissingAutocomplete', 'Este elemento no tiene un atributo de autocompletar. Si este campo recopila información sobre el usuario, considere agregar uno para cumplir con este criterio de éxito.'),
('1_3_6.ARIA11.Check', 'Verifique que se puedan determinar regiones, la principal, encabezados y todas las demás. Les llaman "Landmarks". Ejemplo de "Landmarks": "banner", "main", etc'),
('1_4_10.C32,C31,C33,C38,SCR34,G206', 'Compruebe que el contenido se puede presentar sin pérdida de información o funcionalidad, y sin necesidad de desplazarse en dos dimensiones para:
    - Contenido de desplazamiento vertical en un ancho equivalente a 320 píxeles CSS;
    - Contenido de desplazamiento horizontal a una altura equivalente a 256 píxeles CSS; Excepto por partes del contenido que requieren un diseño bidimensional para su uso o significado.'),
('1_4_10.C32,C31,C33,C38,SCR34,G206.Fixed', 'Este elemento tiene asignado "posición: fija", pero podría requerir el desplazamiento "scroll" en dos dimensiones. Si es así, es considerado un fallo del criterio correspondiente.'),
('1_4_10.C32,C31,C33,C38,SCR34,G206.Scrolling', 'El texto preformateado puede requerir desplazamiento en dos dimensiones, es considerado un fallo del criterio correspondiente.'),
('1_4_10.C32,C31,C33,C38,SCR34,G206.Zoom', 'Interferir con la capacidad de un agente de usuario para hacer zoom puede ser un fallo de este criterio.'),
('1_4_11.G195,G207,G18,G145,G174,F78', 'El radio de contraste debe ser 3:1. Debe haber algo que contraste los elementos que no sean textos y los textos que los acompañan. Ejemplo: Una entrada de texto debe ser visible al lado de la etiqueta. Otro ejemplo: la distinción de un texto que es un link o hipervínculo.'),
('1_4_12.C36,C35', 'El texto cabe en cajas contenedoras sin ser cortado o si traslapar otros textos.'),
('1_4_13.F95', 'Compruebe que cuando coloca, y luego quita el puntero del mouse o el foco del teclado, se activa contenido adicional que se hace visible y luego oculto. Y se cumplen lo siguiente:
- Es descartable: hay un mecanismo (como la tecla "Esc") disponible para descartar el contenido adicional sin mover el puntero del mouse o el foco del teclado, a menos que el contenido adicional comunique un error de entrada o no oculte o reemplace otro contenido;
- Si el puntero puede activar el contenido adicional, entonces el puntero se puede mover sobre el contenido adicional sin que el contenido adicional desaparezca. Ejemplo: utilizar "hover" en html;
- Persistente: el contenido adicional permanece visible hasta que se elimina el activador de desplazamiento o foco, el usuario lo descarta o su información ya no es válida.'),
('2_1_4', 'Para los "shortcuts" o atajos del teclado, verifique que se cumpla al menos una de las siguientes tres cosas: Hay una forma de apagar los “shortcuts”, tiene un mecanismo para remapear cada atajo para usar uno o más teclas que no imprimen (Alt, Ctrl, …), un conjunto de shorcuts o atajos se habilitan por componente ( solo están activos en el componente que esté enfocado ). Ej: Que hayan algunos en la pagina principal.'),
('2_2_6', 'Verifique guardar datos del usuario por al menos 20 horas de inactividad, si estos datos afectan la funcionalidad del sistema para dicho usuario. Además, al inicio, verifique brindarle al usuario una advertencia de la duración de almacenamiento por inactividad.'),
('2_3_3', 'Pueden deshabilitarse las animaciones globalmente, a menos de que estas sean esenciales. Animaciones como “parallax” al bajar con el "scroll" o rueda del mouse. Recomendación: Utilizar "CSS Media Query" para permitir al usuario reduir el movimiento de la página'),
('2_5_1', 'Mayormente en pantallas táctiles, las funcionalidades que usen multiples puntos a la vez, deben poder realizarse con un solo puntero (dedo, lápiz, etc), a menos que sea estrictamente necesario utilizar más de un punto.'),
('2_5_2.SinglePointer_Check', 'Confirme que las funcionalidades puedan realizarse con un sólo puntero. Al presionar el click, se produce un “down event” (el click se encuentra presionado), este evento NO debe tener función, la funcionalidad del sistema se debe dar al soltar el click. Recomendación: Utilizar el evento "key up".'),
('2_5_2.Mousedown_Check', 'Al presionar el click, se produce un “down event” (el click se encuentra presionado), este evento NO debe tener función, la funcionalidad del sistema se debe dar al soltar el click. Recomendación: Utilizar el evento "key up".'),
('2_5_2.Touchstart_Check', 'Al presionar el click, se produce un “down event” (el click se encuentra presionado), este evento NO debe tener función, la funcionalidad del sistema se debe dar al soltar el click. Recomendación: Utilizar el evento "key up".'),
('2_5_3.F96', 'Compruebe que el nombre accesible es incluir un label en los componentes de la interfaz que incluyan texto o imágenes de texto. Este nombre contiene texto que se presenta visualmente.'),
('2_5_3.F96.AccessibleName',  'Compruebe que el nombre accesible es incluir un label en los componentes de la interfaz que incluyan texto o imágenes de texto. Este nombre contiene texto que se presenta visualmente.'),
('2_5_4', 'Verifique que las funcionalidades pueden utilizarse mediante “device motion” o gestos y movimiento, así como con controles disponibles en la interfaz. Esta opción se utiliza mayormente en dispositivos móviles.'),
('2_5_4.Devicemotion', 'Este elemento tiene un detector de eventos de movimiento del dispositivo. Las funcionalidades pueden utilizarse mediante “device motion” o gestos y movimiento, así como con controles disponibles en la interfaz. Excepto cuando el movimiento se utiliza para operar la funcionalidad a través de una interfaz compatible con accesibilidad y si el movimiento es esencial para la función y hacerlo invalidaría la actividad.'),
('2_5_5', 'El tamaño del área para puntear o hacer click es de al menos 44x44 CSS pixeles, excepto cuando: Hay otro link equivalente que lleva a lo mismo, el objetivo está en medio de un texto, el tamaño del objetivo es definido por el usuario. Ejemplo: botones, un ícono de ayuda, un link de texto en un párrafo.'),
('2_5_6', 'El tamaño del área para puntear o hacer click es de al menos 44x44 CSS pixeles, excepto cuando: Hay otro link equivalente que lleva a lo mismo, el objetivo está en medio de un texto, el tamaño del objetivo es definido por el usuario. Ejemplo: botones, un ícono de ayuda, un link de texto en un párrafo.'),
('4_1_3.ARIA22,G199,ARIA19,G83,G84,G85,G139,G177,G194,ARIA23', 'Verifique si el cambio en el estado de alguna parte de la página se ve reflejado para ser una asistencia. Ejemplo: Al presionar el botón de búsqueda se muestra un mensaje con la cantidad de resultados encontrados.'),
('1_1_1.H53,ARIA6', 'Los elementos deben contener al menos una alternativa textual.'),
('4_1_2.ARIA6', 'El control del form tiene un atributo \"aria-label\" que está vacío o contiene solo espacios en blanco.'),
('1_3_1.ARIA6', 'El control del form tiene un atributo \"aria-label\" que está vacío o contiene solo espacios en blanco.'),
('1_3_1.F92,ARIA4', 'Revise si su contenido con el rol \"presentation\" realmente no necesita valor semántico, si es así \nse puede considerar el \"role\" correspondiente.'),
('1_4_10.C32,C31,C33,C38,SCR34,G206', 'En este elemento se utiliza \"position: fixed\". En caso de requerir desplazarse en la pantalla en dos dimensiones, puede generar un fallo en este criterio. Se recomienda revisar que el elemento cumpla con el criterio o bien utilizar atributos que permitan visualizarlo correctamente en todas las posibles orientaciones de la pantalla.'),
('1_1_1.undefined', 'Las imágenes dentro de links no deben usar texto alternativo que duplique el contenido del texto del link adjunto.'),
('1_3_5.H98', 'Este elemento contiene un potencial fallo en el valor del atributo de autocompletado.'),
('1_3_1.ARIA6', 'El control del form tiene un atributo \"aria-label\" vacío o contiene solo espacios en blanco');


INSERT INTO `DS_EAW`.`Browsers` (`name`, `browserVersion`, `isActive`) VALUES 
('Chrome', '80.0.03', '1'),
('Mozilla Firefox', null, '1'),
('Safari', null, '1'),
('Opera', null, '1'),
('Microsoft Edge', null, '1');


INSERT INTO `DS_EAW`.`Countries` (`name`, `prefix`) VALUES 
('Andorra', 'AD'),
('Emiratos Árabes Unidos', 'AE'),
('Afganistán', 'AF'),
('Antigua y Barbuda', 'AG'),
('Anguilla', 'AI'),
('Albania', 'AL'),
('Armenia', 'AM'),
('Antillas Holandesas', 'AN'),
('Angola ', 'AO'),
('Antártida', 'AQ'),
('Argentina', 'AR'),
('Samoa Americana', 'AS'),
('Austria ', 'AT'),
('Australia', 'AU'),
('Aruba', 'AW'),
('Azerbayán', 'AZ'),
('Bosnia-Herzegovina', 'BA'),
('Barbados', 'BB'),
('Bangladesh', 'BD'),
('Bélgica', 'BE'),
('Burkina Faso', 'BF'),
('Bulgaria', 'BG'),
('Bahrain', 'BH'),
('Burundi', 'BI'),
('Benín', 'BJ'),
('Islas Bermudas', 'BM'),
('Brunei Darussalam', 'BN'),
('Bolivia', 'BO'),
('Brasil', 'BR'),
('Bahamas', 'BT'),
('Bután', 'BS'),
('Islas Buvet', 'BV'),
('Botswana', 'BW'),
('Bielorrusia', 'BY'),
('Belice', 'BZ'),
('Canadá', 'CA'),
('Isla de Cocos', 'CC'),
('República Democrática del Congo ', 'CD'),
('República Centroafricana', 'CF'),
('República del Congo', 'CG'),
('Suiza', 'CH'),
('Costa de marfil', 'CI'),
('Islas Cook', 'CK'),
('Chile', 'CL'),
('Camerún', 'CM'),
('China', 'CN'),
('Colombia', 'CO'),
('Costa Rica', 'CR'),
('Checoslovaquia (antiguo país)', 'CS'),
('Cuba', 'CU'),
('Cabo Verde', 'CV'),
('Islas Christmas', 'CX'),
('Chipre', 'CY'),
('República Checa', 'CZ'),
('Alemania', 'DE'),
('Djibouti', 'DJ'),
('Dinamarca', 'DK'),
('Dominica', 'DM'),
('República Dominicana', 'DO'),
('Argelia', 'DZ'),
('Ecuador', 'EC'),
('Estonia', 'EE'),
('Egipto', 'EG'),
('Sáhara Occidental', 'EH'),
('Eritrea', 'ER'),
('España', 'ES'),
('Etiopía', 'ET'),
('Finlandia', 'FI'),
('Fiji', 'FJ'),
('Islas Malvinas', 'FK'),
('Micronesia', 'FM'),
('Islas Feroe', 'FO'),
('Francia', 'FR'),
('Gabón', 'GA'),
('Granada', 'GD'),
('Georgia', 'GE'),
('Guyana Francesa', 'GF'),
('Guernsey', 'GG'),
('Ghana', 'GH'),
('Gibraltar', 'GI'),
('Groenlandia', 'GL'),
('Gambia', 'GM'),
('Guinea', 'GN'),
('Guadalupe', 'GP'),
('Guinea Ecuatorial', 'GQ'),
('Grecia', 'GR'),
('Islas Georgias y Sandwich del Sur', 'GS'),
('Guatemala', 'GT'),
('Guam', 'GU'),
('Guinea-Bissau', 'GW'),
('Guayana', 'GY'),
('Hong Kong', 'HK'),
('Islas Heard y McDonald', 'HM'),
('Honduras', 'HN'),
('Croacia', 'HR'),
('Haití', 'HT'),
('Hungría', 'HU'),
('Indonesia', 'ID'),
('Irlanda', 'IE'),
('Israel', 'IL'),
('Isla de Man', 'IM'),
('India', 'IN'),
('Territorio británico del Océano Índico', 'IO'),
('Iraq', 'IQ'),
('Irán', 'IR'),
('Islandia', 'IS'),
('Italia', 'IT'),
('Jamaica', 'JM'),
('Jersey', 'JE'),
('Jordania', 'JO'),
('Japón', 'JP'),
('Kenia', 'KE'),
('Kyrgystán', 'KG'),
('Camboya', 'KH'),
('Kiribati', 'KI'),
('Islas Comores', 'KM'),
('San Kitts y Nevis', 'KN'),
('Corea del Norte', 'KP'),
('Corea del Sur', 'KR'),
('Kuwait', 'KW'),
('Islas Caimán', 'KY'),
('Kazajistán', 'KZ'),
('Laos', 'LA'),
('Líbano', 'LB'),
('Santa Lucía', 'LC'),
('Liechtenstein', 'LI'),
('Sri Lanka', 'LK'),
('Liberia', 'LR'),
('Lesoto', 'LS'),
('Lituania', 'LT'),
('Luxemburgo', 'LU'),
('Letonia', 'LV'),
('Libia', 'LY'),
('Marruecos', 'MA'),
('Mónaco', 'MC'),
('Moldavia', 'MD'),
('Madagascar', 'MG'),
('Macedonia', 'MK'),
('Islas Marshall', 'MH'),
('Mali', 'ML'),
('Birmania', 'MM'),
('Mongolia', 'MN'),
('Macao', 'MO'),
('Islas Marianas', 'MP'),
('Martinica', 'MQ'),
('Mauritania', 'MR'),
('Montserrat', 'MS'),
('Malta', 'MT'),
('Mauricio', 'MU'),
('Maldivas', 'MV'),
('Malawi', 'MW'),
('México', 'MX'),
('Malasia', 'MY'),
('Mozambique', 'MZ'),
('Namibia', 'NA'),
('Nueva Caledonia', 'NC'),
('Níger', 'NE'),
('Islas Norfolk', 'NF'),
('Nigeria', 'NG'),
('Nicaragua', 'NI'),
('Países Bajos', 'NL'),
('Noruega', 'NO'),
('Nepal', 'NP'),
('Nauru', 'NR'),
('Zona Neutral', 'NT'),
('Niue', 'NU'),
('Nueva Zelanda', 'NZ'),
('Omán', 'OM'),
('Panamá', 'PA'),
('Perú', 'PE'),
('Polinesia Francesa', 'PF'),
('Papúa Nueva Guinea', 'PG'),
('Filipinas', 'PH'),
('Pakistán', 'PK'),
('Polonia', 'PL'),
('San Pedro y Miquelón', 'PM'),
('Pitcairn', 'PN'),
('Puerto Rico', 'PR'),
('Territorios Palestinos', 'PS'),
('Portugal', 'PT'),
('Palau', 'PW'),
('Paraguay', 'PY'),
('Qatar', 'QA'),
('Isla Reunión', 'RE'),
('Rumanía', 'RO'),
('Rusia', 'RU'),
('Ruanda', 'RW'),
('Arabia Saudí', 'SA'),
('Islas Salomón', 'SB'),
('Islas Seychelles', 'SC'),
('Sudán', 'SD'),
('Suecia', 'SE'),
('Singapur', 'SG'),
('Santa Helena', 'SH'),
('Eslovenia', 'SI'),
('Islas Svalbard y Jan Mayens', 'SJ'),
('Eslovaquia', 'SK'),
('Sierra Leona', 'SL'),
('San Marino', 'SM'),
('Senegal', 'SN'),
('Somalia', 'SO'),
('Surinam', 'SR'),
('URSS', 'SU'),
('Santo Tomé y Príncipe', 'ST'),
('El Salvador', 'SV'),
('Siria', 'SY'),
('Suazilandia', 'SZ'),
('Islas Turks y Caicos', 'TC'),
('Chad', 'TD'),
('Tierras Australes y Antárticas Francesas', 'TF'),
('Togo', 'TG'),
('Tailandia', 'TH'),
('Tayikistán', 'TJ'),
('Tokelau', 'TK'),
('Turkmenistán', 'TM'),
('Túnez', 'TN'),
('Tonga', 'TO'),
('Timor Oriental', 'TP'),
('Turquía', 'TR'),
('Trinidad y Tobago', 'TT'),
('Tuvalu', 'TV'),
('Taiwán', 'TW'),
('Tanzania', 'TZ'),
('Ucrania', 'UA'),
('Uganda', 'UG'),
('Reino Unido', 'UK'),
('Islas Ultramarinas de Estados Unidos ', 'UM'),
('Estados Unidos de América', 'US'),
('Uruguay', 'UY'),
('Uzbekistán', 'UZ'),
('Vaticano', 'VA'),
('San Vicente y las Granadinas', 'VC'),
('Venezuela', 'VE'),
('Islas Vírgenes Británicas', 'VG'),
('Islas Vírgenes Americanas', 'VI'),
('Vietnam', 'VN'),
('Vanuatu', 'VU'),
('Islas Wallis y Futuna', 'WF'),
('Samoa', 'WS'),
('Yemen', 'YE'),
('Mayotte', 'YT'),
('Yugoslavia (antiguo país)', 'YU'),
('Sudáfrica', 'ZA'),
('Zambia', 'ZM'),
('Zaire (antiguo país)', 'ZR'),
('Zimbabwe', 'ZW');


INSERT INTO `DS_EAW`.`Principles` (`name`, `referenceLink`, `descriptionPath`) VALUES
('Perceptible', 'http://accesibilidadweb.dlsi.ua.es/?menu=principios-2.1', 'utils.principles.perceivable'),
('Operable', 'http://accesibilidadweb.dlsi.ua.es/?menu=principios-2.1', 'utils.principles.operable'),
('Comprensible', 'http://accesibilidadweb.dlsi.ua.es/?menu=principios-2.1', 'utils.principles.understandable'),
('Robusto', 'http://accesibilidadweb.dlsi.ua.es/?menu=principios-2.1', 'utils.principles.robust');


INSERT INTO `DS_EAW`.`Guidelines` (`numberGuidelines`, `name`, `principlesId`, `referenceLink`) VALUES
('1.1', 'Alternativas Textuales', '1', 'https://www.w3.org/TR/WCAG21/#text-alternatives'),
('1.2', 'Multimedia', '1', 'https://www.w3.org/TR/WCAG21/#time-based-media'),
('1.3', 'Adaptable', '1', 'https://www.w3.org/TR/WCAG21/#adaptable'),
('1.4', 'Distinguible', '1', 'https://www.w3.org/TR/WCAG21/#distinguishable'),
('2.1', 'Teclado accesible', '2', 'https://www.w3.org/TR/WCAG21/#keyboard-accessible'),
('2.2', 'Tiempo suficiente', '2', 'https://www.w3.org/TR/WCAG21/#enough-time'),
('2.3', 'Ausencia de efectos dañinos', '2', 'https://www.w3.org/TR/WCAG21/#seizures-and-physical-reactions'),
('2.4', 'Navegable', '2', 'https://www.w3.org/TR/WCAG21/#navigable'),
('3.1', 'Legible', '3', 'https://www.w3.org/TR/WCAG21/#readable'),
('3.2', 'Predecible', '3', 'https://www.w3.org/TR/WCAG21/#predictable'),
('3.3', 'Entrada de datos asistida', '3', 'https://www.w3.org/TR/WCAG21/#input-assistance'),
('4.1', 'Compatibilidad actual y futura', '4', 'https://www.w3.org/TR/WCAG21/#compatible'),
('2.5', 'Modalidades de entrada', '2', 'https://www.w3.org/TR/WCAG21/#input-modalities');


INSERT INTO `DS_EAW`.`Criterions` (`numberCriterion`, `name`, `guidelinesId`, `level`, `criterionDescription`) VALUES
('1.1.1', 'Contenido no textual', '1', 'A', 'Todo contenido no textual que se presenta al usuario tiene una alternativa textual que cumple el mismo propósito.'),
('1.2.1', 'Sólo audio y sólo vídeo (grabado)', '2', 'A', 'Para contenido sólo audio grabado y contenido sólo vídeo grabado, se cumple lo siguiente, excepto cuando el audio o el vídeo es un contenido multimedia alternativo al texto y está claramente identificado como tal:
Sólo audio grabado: Se proporciona una alternativa para los medios tempodependientes que presenta información equivalente para el contenido sólo audio grabado.
Sólo vídeo grabado: Se proporciona una alternativa para los medios tempodependientes o se proporciona una pista sonora que presenta información equivalente al contenido del medio de sólo vídeo grabado.'),
('1.2.2', 'Subtítulos (grabado)', '2', 'A', 'Se proporcionan subtítulos para el contenido de audio grabado dentro de contenido multimedia sincronizado, excepto cuando la presentación es un contenido multimedia alternativo al texto y está claramente identificado como tal.'),
('1.2.3', 'Audiodescripción o Medio Alternativo (grabado)', '2', 'A', 'Se proporciona una alternativa para los medios tempodependientes o una audiodescripción para el contenido de vídeo grabado en los multimedia sincronizados, excepto cuando ese contenido es un contenido multimedia alternativo al texto y está claramente identificado como tal.'),
('1.2.4', 'Subtítulos (en directo)', '2', 'AA', 'Se proporcionan subtítulos para todo el contenido de audio en directo de los multimedia sincronizados.'),
('1.2.5', 'Audiodescripción (grabado)', '2', 'AA', 'Se proporciona una audiodescripción para todo el contenido de vídeo grabado dentro de contenido multimedia sincronizado.'),
('1.2.6', 'Lengua de señas (grabado)', '2', 'AAA', 'Se proporciona una interpretación en lengua de señas para todo el contenido de audio grabado dentro de contenido multimedia sincronizado.'),
('1.2.7', 'Audiodescripción Ampliada (grabada)', '2', 'AAA', 'Cuando las pausas en el audio de primer plano son insuficientes para permitir que la audiodescripción comunique el significado del vídeo, se proporciona una audiodescripción ampliada para todos los contenidos de vídeo grabado dentro de contenido multimedia sincronizado.'),
('1.2.8', 'Medio Alternativo (grabado)', '2', 'AAA', 'Se proporciona una alternativa para los medios tempodependientes, tanto para todos los contenidos multimedia sincronizados grabados como para todos los medios de sólo vídeo grabado.'),
('1.2.9', 'Sólo audio (directo)', '2', 'AAA', 'Se proporciona una alternativa para los medios tempodependientes que presenta información equivalente para el contenido de sólo audio en directo.'),
('1.3.1', 'Información y relaciones', '3', 'A', 'La información, estructura y relaciones comunicadas a través de la presentación pueden ser determinadas por software o están disponibles como texto.'),
('1.3.2', 'Secuencia significativa', '3', 'A', 'Cuando la secuencia en que se presenta el contenido afecta a su significado, se puede determinar por software la secuencia correcta de lectura.'),
('1.3.3', 'Características sensoriales', '3', 'A', 'Las instrucciones proporcionadas para entender y operar el contenido no dependen exclusivamente en las características sensoriales de los componentes como su forma, tamaño, ubicación visual, orientación o sonido.'),
('1.4.1', 'Uso del color', '4', 'A', 'El color no se usa como único medio visual para transmitir la información, indicar una acción, solicitar una respuesta o distinguir un elemento visual.'),
('1.4.2', 'Control del audio', '4', 'A','Si el audio de una página web suena automáticamente durante más de 3 segundos, se proporciona ya sea un mecanismo para pausar o detener el audio, o un mecanismo para controlar el volumen del sonido que es independiente del nivel de volumen global del sistema.'),
('1.4.3', 'Contraste (mínimo)', '4', 'AA', 'La presentación visual de texto e imágenes de texto tiene una relación de contraste de, al menos, 4.5:1, excepto en los siguientes casos:
Textos grandes: Los textos de gran tamaño y las imágenes de texto de gran tamaño tienen una relación de contraste de, al menos, 3:1.
Incidental: Los textos o imágenes de texto que forman parte de un componente inactivo de la interfaz de usuario, que son simple decoración, que no resultan visibles para nadie o forman parte de una imagen que contiene otros elementos visuales significativos, no tienen requisitos de contraste.
Logotipos: El texto que forma parte de un logo o nombre de marca no tiene requisitos de contraste mínimo.'),
('1.4.4', 'Cambio de tamaño del texto', '4', 'AA', 'A excepción de los subtítulos y las imágenes de texto, todo el texto puede ser ajustado sin ayudas técnicas hasta un 200 por ciento sin que se pierdan el contenido o la funcionalidad.'),
('1.4.5', 'Imágenes de texto', '4', 'AA', 'Si con las tecnologías que se están utilizando se puede conseguir la presentación visual deseada, se utiliza texto para transmitir la información en vez de imágenes de texto, excepto en los siguientes casos:
Configurable: La imagen de texto es visualmente configurable según los requisitos del usuario.
Esencial: Una forma particular de presentación del texto resulta esencial para la información que se transmite.
Nota: Los logotipos (textos que son parte de un logo o de un nombre de marca) se consideran esenciales.'),
('1.4.6', 'Contraste (mejorado)', '4', 'AAA', 'La presentación visual de texto e imágenes de texto tiene una relación de contraste de, al menos, 7:1, excepto en los siguientes casos:
Textos grandes: Los textos de gran tamaño y las imágenes de texto de gran tamaño tienen una relación de contraste de, al menos, 4.5:1.
Incidental: Los textos o imágenes de texto que forman parte de un componente de la interfaz de usuario inactivo, que son simple decoración, que no resultan visibles para nadie o forman parte de una imagen que contiene otros elementos visuales significativos, no tienen requisitos de contraste.
Logotipos: El texto que forma parte de un logo o nombre de marca no tiene requisitos de contraste mínimo.'),
('1.4.7', 'Sonido de fondo bajo o ausente', '4', 'AAA', 'Para el contenido de sólo audio grabado que (1) contiene habla en primer plano, (2) no es un CAPTCHA sonoro o un audiólogo, y (3) que no es una vocalización cuya intención principal es servir como expresión musical (como el canto o el rap), se cumple al menos uno de los siguientes casos:
Ningún sonido de fondo: El audio no contiene sonidos de fondo.
Apagar: Los sonidos de fondo pueden ser apagados.
20 dB: Los sonidos de fondo son, al menos, 20 decibelios más bajos que el discurso en primer plano, con la excepción de sonidos ocasionales que duran solamente uno o dos segundos.
Nota: Por la definición de "decibelio", el sonido de fondo que cumple con este requisito es aproximadamente cuatro veces más silencioso que la locución principal.'),
('1.4.8', 'Presentación visual', '4', 'AAA', 'En la presentación visual de bloques de texto, se proporciona algún mecanismo para lograr lo siguiente:
1. Los colores de fondo y primer plano pueden ser elegidos por el usuario.
2. El ancho no es mayor de 80 caracteres o signos (40 si es CJK).
3. El texto no está justificado (alineado a los márgenes izquierdo y derecho a la vez).
4. El espacio entre líneas (interlineado) es de, al menos, un espacio y medio dentro de los párrafos y el espacio entre párrafos es, al menos, 1.5 veces mayor que el espacio entre líneas.
5. El texto se ajusta sin ayudas técnicas hasta un 200 por ciento de modo tal que no requiere un desplazamiento horizontal para leer una línea de texto en una ventana a pantalla completa.'),
('1.4.9', 'Imágenes de texto (sin excepción)', '4', 'AAA', 'Las imágenes de texto sólo se utilizan como simple decoración o cuando una forma de presentación particular del texto resulta esencial para la información transmitida. Nota: Los logotipos (textos que son parte de un logo o de un nombre de marca) se consideran esenciales.'),
('2.1.1','Teclado','5','A','Toda la funcionalidad del contenido es operable a través de una interfaz de teclado sin que se requiera una determinada velocidad para cada pulsación individual de las teclas, excepto cuando la función interna requiere de una entrada que depende del trayecto de los movimientos del usuario y no sólo de los puntos inicial y final.'),
('2.1.2','Sin trampas para el foco del teclado','5','A','Si es posible mover el foco a un componente de la página usando una interfaz de teclado, entonces el foco se puede quitar de ese componente usando sólo la interfaz de teclado y, si se requiere algo más que las teclas de dirección o de tabulación, se informa al usuario el método apropiado para mover el foco.'),
('2.1.3','Sin trampas para el foco del teclado (sin excepciones)','5','AAA','Toda la funcionalidad del contenido se puede operar a través de una interfaz de teclado sin requerir una determinada velocidad en la pulsación de las teclas.'),
('2.2.1','Tiempo ajustable','6','A','Para cada límite de tiempo impuesto por el contenido, se cumple al menos uno de los siguientes casos: Apagar, Ajustar, Extender, Excepción en tiempo real, Excepción por ser esencial, Excepción de 20 horas.'),
('2.2.2','Poner en pausa, detener, ocultar','6','A','Para la información que tiene movimiento, parpadeo, se desplaza o se actualiza automáticamente, se cumplen todos los casos siguientes:
Movimiento, parpadeo, desplazamiento: Para toda información que se mueve, parpadea o se desplaza, que (1) comienza automáticamente, (2) dura más de cinco segundos y (3) se presenta en paralelo con otro contenido, existe un mecanismo para que el usuario la pueda poner en pausa, detener u ocultar, a menos que el movimiento, parpadeo o desplazamiento sea parte esencial de una actividad; y Actualización automática: Para toda información que se actualiza automáticamente, que (1) se inicia automáticamente y (2) se presenta en paralelo con otro contenido, existe un mecanismo para que el usuario la pueda poner en pausa, detener u ocultar, o controlar la frecuencia de actualización a menos que la actualización automática sea parte esencial de una actividad.'),
('2.2.3', 'Sin tiempo', '6', 'AAA', 'El tiempo no es parte esencial del evento o actividad presentada por el contenido, exceptuando los multimedia sincronizados no interactivos y los eventos en tiempo real.'),
('2.2.4', 'Interrupciones', '6', 'AAA', 'El usuario puede postergar o suprimir las interrupciones, excepto cuando las interrupciones implican una emergencia.'),
('2.2.5', 'Re-autentificación', '6', 'AAA', 'Cuando expira una sesión autenticada, el usuario puede continuar la actividad sin pérdida de datos tras volver a identificarse.'),
('2.3.1', 'Umbral de tres destellos o menos', '7', 'A', 'Las páginas web no contienen nada que destelle más de tres veces en un segundo, o el destello está por debajo del umbral de destello general y de destello rojo. Nota: En la medida en que cualquier contenido que no satisfaga este criterio puede interferir con la capacidad del usuario para emplear la página como un todo, todo contenido de la página web (tanto si satisface o no otros criterios de conformidad) debe satisfacer este criterio.'),
('2.3.2', 'Tres destellos', '7', 'AAA', 'Las páginas web no contienen nada que destelle más de tres veces por segundo.'),
('2.4.1', 'Evitar bloques', '8','A', 'Existe un mecanismo para evitar los bloques de contenido que se repiten en múltiples páginas web.'),
('2.4.2','Titulado de páginas', '8','A','Las páginas web tienen títulos que describen su temática o propósito.'),
('2.4.3','Orden del foco','8','A','Si se puede navegar secuencialmente por una página web y la secuencia de navegación afecta su significado o su operación, los componentes que pueden recibir el foco lo hacen en un orden que preserva su significado y operabilidad.'),
('2.4.4','Propósito de los enlaces (en contexto)','8', 'A', 'El propósito de cada enlace puede ser determinado con sólo el texto del enlace o a través del texto del enlace sumado al contexto del enlace determinado por software, excepto cuando el propósito del enlace resulta ambiguo para los usuarios en general.'),
('2.4.5', 'Multiples vías', '8', 'AA', 'Se proporciona más de un camino para localizar una página web dentro de un conjunto de páginas web, excepto cuando la página es el resultado, o un paso intermedio, de un proceso.'),
('2.4.6', 'Encabezados y etiquetas', '8', 'AA','Los encabezados y etiquetas describen el tema o propósito.'),
('2.4.7','Foco visible','8', 'AA', 'Cualquier interfaz de usuario operable por teclado tiene una forma de operar en la cual el indicador del foco del teclado resulta visible.'),
('2.4.8', 'Ubicación', '8', 'AAA', 'Se proporciona información acerca de la ubicación del usuario dentro de un conjunto de páginas web.'),
('2.4.9', 'Propósito de los enlaces (sólo enlaces)', '8', 'AAA', 'Se proporciona un mecanismo que permite identificar el propósito de cada enlace con sólo el texto del enlace, excepto cuando el propósito del enlace resulta ambiguo para los usuarios en general.'),       
('2.4.10', 'Encabezados de sección', '8', 'AAA', 'Se usan encabezados de sección para organizar el contenido. Nota 1: "Encabezados" se usa en sentido general e incluye los títulos y otras formas de agregar encabezados a las distintos tipos de contenido. Nota 2: Este criterio de conformidad se refiere al contenido propiamente dicho, no a los componentes de la interfaz de usuario. Los componentes de la interfaz de usuario se tratan en el Criterio de Conformidad 4.1.2.'),
('3.1.1', 'Idioma de la página', '9', 'A', 'El idioma predeterminado de cada página web puede ser determinado por software.'),
('3.1.2', 'Idioma de las partes', '9', 'AA', 'El idioma de cada pasaje o frase en el contenido puede ser determinado por software, excepto los nombres propios, términos técnicos, palabras en un idioma indeterminado y palabras o frases que se hayan convertido en parte natural del texto que las rodea.'),
('3.1.3', 'Palabras inusuales', '9', 'AAA', 'Se proporciona un mecanismo para identificar las definiciones específicas de palabras o frases usadas de modo inusual o restringido, incluyendo expresiones idiomáticas y jerga.'),
('3.1.4', 'Abreviaturas', '9', 'AAA', 'Se proporciona un mecanismo para identificar la forma expandida o el significado de las abreviaturas.'),
('3.1.5', 'Nivel de lectura', '9', 'AAA', 'Cuando un texto requiere un nivel de lectura más avanzado que el nivel mínimo de educación secundaria una vez que se han eliminado nombres propios y títulos, se proporciona un contenido suplementario o una versión que no requiere un nivel de lectura mayor a ese nivel educativo.'),
('3.1.6', 'Pronunciación', '9', 'AAA', 'Se proporciona un mecanismo para identificar la pronunciación específica de las palabras cuando el significado de esas palabras, dentro del contexto, resulta ambiguo si no se conoce su pronunciación.'),
('3.2.1', 'Al recibir el foco', '10', 'A', 'Cuando cualquier componente recibe el foco, no inicia ningún cambio en el contexto.'),
('3.2.2', 'Al recibir entradas', '10', 'A', 'El cambio de estado en cualquier componente de la interfaz de usuario no provoca automáticamente un cambio en el contexto a menos que el usuario haya sido advertido de ese comportamiento antes de usar el componente.'),
('3.2.3', 'Navegación coherente', '10', 'AA', 'Los mecanismos de navegación que se repiten en múltiples páginas web dentro de un conjunto de páginas web aparecen siempre en el mismo orden relativo cada vez que se repiten, a menos que el cambio sea provocado por el propio usuario.'),
('3.2.4', 'Identificación coherente', '10', 'AA', 'Los componentes que tienen la misma funcionalidad dentro de un conjunto de páginas web son identificados de manera coherente.'),
('3.2.5', 'Cambios a petición', '10', 'AAA', 'Los cambios en el contexto son iniciados únicamente a solicitud del usuario o se proporciona un mecanismo para detener tales cambios.'),
('3.3.1', 'Identificación de errores', '11', 'A', 'Si se detecta automáticamente un error en la entrada de datos, el elemento erróneo es identificado y el error se describe al usuario mediante un texto.'),
('3.3.2', 'Etiquetas o instrucciones', '11', 'A', 'Se proporcionan etiquetas o instrucciones cuando el contenido requiere la introducción de datos por parte del usuario.'),
('3.3.3', 'Sugerencias ante errores', '11', 'AA', 'Si se detecta automáticamente un error en la entrada de datos y se dispone de sugerencias para hacer la corrección, entonces se presentan las sugerencias al usuario, a menos que esto ponga en riesgo la seguridad o el propósito del contenido.'),
('3.3.4', 'Prevención de errores (legal, financieros, datos)', '11', 'AA', 'Para las páginas web que representan para el usuario compromisos legales o transacciones financieras; que modifican o eliminan datos controlables por el usuario en sistemas de almacenamiento de datos; o que envían las respuestas del usuario a una prueba, se cumple al menos uno de los siguientes casos.
Reversible: El envío es reversible.
Revisado: Se verifica la información para detectar errores en la entrada de datos y se proporciona al usuario una oportunidad de corregirlos.
Confirmado: Se proporciona un mecanismo para revisar, confirmar y corregir la información antes de finalizar el envío de los datos.'),
('3.3.5', 'Ayuda', '11', 'AAA', 'Se proporciona ayuda dependiente del contexto.'),
('3.3.6', 'Prevención de errores (todos)', '11', 'AAA', 'Para las páginas web que requieren al usuario el envío de información, se cumple al menos uno de los siguientes casos:
Reversible: El envío es reversible.
Revisado: Se verifica la información para detectar errores en la entrada de datos y se proporciona al usuario una oportunidad de corregirlos.
Confirmado: Se proporciona un mecanismo para revisar, confirmar y corregir la información antes de finalizar el envío de los datos.'),
('4.1.1', 'Procesamiento', '12', 'A', 'En los contenidos implementados mediante el uso de lenguajes de marcas, los elementos tienen las etiquetas de apertura y cierre completas; los elementos están anidados de acuerdo a sus especificaciones; los elementos no contienen atributos duplicados y los ID son únicos, excepto cuando las especificaciones permitan estas características.'),
('4.1.2', 'Nombre, función, valor', '12', 'A', 'Para todos los componentes de la interfaz de usuario (incluyendo pero no limitado a: elementos de formulario, enlaces y componentes generados por scripts), el nombre y la función pueden ser determinados por software; los estados, propiedades y valores que pueden ser asignados por el usuario pueden ser especificados por software; y los cambios en estos elementos se encuentran disponibles para su consulta por las aplicaciones de usuario, incluyendo las ayudas técnicas.'),
('1.3.4', 'Orientación', '3', 'AA', 'El contenido no se restringe a una sola vista, debe permitir cambiar la orientación, por ejemplo, entre portrait y landscape, puede ser una opción “Mostrar / Ocultar” para permitir el acceso a contenido en diferentes orientaciones.'),
('1.3.5', 'Identificar el propósito de entradas de datos', '3', 'AA', 'El propósito de cada entrada de texto se determina. Se determinan por ejemplo en usar opciones de auto-relleno, de forma que el usuario no tenga que recordar todo o utilizar iconos representativos para que el ingreso de datos se entienda visualmente (Como un teléfono en el input del número telefónico).'),
('1.3.6', 'Identificar propósito', '3', 'AAA', 'Que se puedan determinar regiones, la principal, encabezados y todas las demás. Les llaman Landmarks.'),
('1.4.10', 'Cambio de flujo', '4', 'AA', 'Al cambiar el tamaño de la pantalla, se deben mantener las dimensiones del texto e imágenes. De forma que si hay varias columnas, al realizar zoom, pueden haber menos columnas para mantener el radio de visión. En un reflow o redimensión, se deben mantener los toolbars o barras de herramientas.'),
('1.4.11', 'Contraste no textual', '4', 'AA', 'El radio de contraste debe ser 3:1. Debe haber algo que contraste los elementos que no sean textuales, como resaltar hipervínculos.'),
('1.4.12', 'Espacio del texto', '4', 'AA', 'El texto cabe en cajas contenedoras sin ser cortado o si traslapar otros textos.'),
('1.4.13', 'Contenido sobre vuelo o enfocado', '4', 'AA', 'Que exista un contenido de ayuda que se puede mostrar con colocar el mouse encima o con una tecla. El texto de ayuda no debe afectar el contenido. El contenido de ayuda debe poder quitarse o ponerse con una tecla como Exit o seleccionando un botón de cerrar. Si un usuario incrementa el tamaño del cursor mediante la configuración en la plataforma, igual debe poder ver el contenido flotante oscurecido (hover). Incluso si se utiliza la magnificación (zoom en una zona).'),
('2.1.4', 'Teclas de atajos de teclado', '5', 'A', 'Pueden configurarse con caracteres si: -Hay una forma de apagar los “shortcuts”. -Tiene un mecanismo para remapear cada atajo para usar uno o más teclas que no imprimen (Alt, Ctrl, …). -Un conjunto de shortcuts o atajos se habilitan por componente ( solo están activos en el componente que esté enfocado ). Ej: Que hayan algunos atajos propios de la página principal.'),
('2.2.6', 'Tiempo Límite', '6', 'AAA', 'Guardar datos del usuario por al menos 20 horas de inactividad. Al inicio, darle al usuario una advertencia de la duración de almacenamiento por inactividad. Por ejemplo, datos del inicio de sesión.'),
('2.3.3', 'Animación desde interacciones', '7', 'AAA', 'Pueden deshabilitarse las animaciones globalmente, a menos de que estas sean esenciales. Animaciones como “parallax” al bajar con el scroll del mouse.'),
('2.5.1', 'Gestos de punteros', '13', 'A', 'Todas las funcionalidades que usen multipuntos, deben poder realizarse con un solo puntero. A menos que sea estrictamente necesario. Nota: Gestos de múltiples puntos son comunes en las pantallas táctiles.'),
('2.5.2', 'Cancelación del puntero', '13', 'A', 'Al presionar el click, se produce un “down event” (el click se encuentra presionado), este evento NO debe tener función, la funcionalidad se da al soltar el click. Si se suelta el click en otro lugar distinto a donde se inició el click, se cancela la acción. Que “down event” ejecute una función se permite solo si “up event” (como cuando se deja de presionar el click) no se va a utilizar.'),
('2.5.3', 'Etiqueta en nombre', '13', 'A', 'Un nombre accesible es incluir una etiqueta en los componentes de la interfaz gráfica. El nombre accesible debe calzar con la etiqueta.'),
('2.5.4', 'Acción de movimiento', '13', 'A', 'Las funcionalidades pueden utilizarse tanto mediante “device motion” o gestos y movimiento como con controles disponibles en la interfaz. Ejemplo: Luego de llenar un formulario, agitar, inclinar el dispositivo para continuar o navegar. Y deben haber controles visuales alternativos.'),
('2.5.5', 'Tamaño del objetivo', '13', 'AAA', 'El tamaño del área para puntear o hacer click es de al menos 44x44 CSS pixeles, excepto cuando: -Hay otro link equivalente que lleva a lo mismo. -El objetivo está en medio de un texto. - El tamaño del objetivo es definido por el usuario.'),
('2.5.6', 'Mecanismos de entrada concurrentes', '13', 'AAA', 'El contenido web no restringe el uso de modalidades de entrada disponibles excepto cuando la restricción es “esencial” (motivos de seguridad o por respetar la configuración del usuario). Por ejemplo: Un usuario que pueda utilizar una pantalla táctil y a la vez un teclado porque necesita mejor precisión.'),
('4.1.3', 'Mensaje de estado', '12', 'AA', 'El cambio en el estado de alguna parte de la página se ve reflejado, con el fin de ser perceptible al usuario. Por ejemplo: si se ingresa un valor incorrecto en un input, aparece un texto informativo indicando lo sucedido.');
-- Level A criterions
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#non-text-content' , `ISACTIVE`='1' WHERE `id`='1';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#audio-only-and-video-only-prerecorded' , `ISACTIVE`='1' WHERE `id`='2';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#captions-prerecorded' , `ISACTIVE`='1' WHERE `id`='3';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#audio-description-or-media-alternative-prerecorded' , `ISACTIVE`='1' WHERE `id`='4';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#info-and-relationships' , `ISACTIVE`='1' WHERE `id`='11';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#meaningful-sequence' , `ISACTIVE`='1' WHERE `id`='12';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#sensory-characteristics' , `ISACTIVE`='1' WHERE `id`='13';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#use-of-color' , `ISACTIVE`='1' WHERE `id`='14';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#audio-control' , `ISACTIVE`='1' WHERE `id`='15';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#keyboard' , `ISACTIVE`='1' WHERE `id`='23';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#timing-adjustable' , `ISACTIVE`='1' WHERE `id`='24';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#timing-adjustable' , `ISACTIVE`='1' WHERE `id`='26';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#pause-stop-hide' , `ISACTIVE`='1' WHERE `id`='27';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold' , `ISACTIVE`='1' WHERE `id`='31';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#bypass-blocks' , `ISACTIVE`='1' WHERE `id`='33';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#page-titled' , `ISACTIVE`='1' WHERE `id`='34';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#focus-order' , `ISACTIVE`='1' WHERE `id`='35';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#link-purpose-in-context' , `ISACTIVE`='1' WHERE `id`='36';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#language-of-page' , `ISACTIVE`='1' WHERE `id`='43';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#on-focus' , `ISACTIVE`='1' WHERE `id`='49';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#on-input' , `ISACTIVE`='1' WHERE `id`='50';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#error-identification' , `ISACTIVE`='1' WHERE `id`='54';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#labels-or-instructions' , `ISACTIVE`='1' WHERE `id`='55';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#parsing' , `ISACTIVE`='1' WHERE `id`='60';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#name-role-value' , `ISACTIVE`='1' WHERE `id`='61';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#character-key-shortcuts' , `ISACTIVE`='1' WHERE `id`='69';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#pointer-gestures' , `ISACTIVE`='1' WHERE `id`='72';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#pointer-cancellation' , `ISACTIVE`='1' WHERE `id`='73';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#label-in-name' , `ISACTIVE`='1' WHERE `id`='74';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#motion-actuation' , `ISACTIVE`='1' WHERE `id`='75';
-- Level AA criterions
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#captions-live' , `ISACTIVE`='1' WHERE `id`='5';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#audio-description-prerecorded' , `ISACTIVE`='1' WHERE `id`='6';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#contrast-minimum' , `ISACTIVE`='1' WHERE `id`='16';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#resize-text' , `ISACTIVE`='1' WHERE `id`='17';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#images-of-text' , `ISACTIVE`='1' WHERE `id`='18';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#multiple-ways' , `ISACTIVE`='1' WHERE `id`='37';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#headings-and-labels' , `ISACTIVE`='1' WHERE `id`='38';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#focus-visible' , `ISACTIVE`='1' WHERE `id`='39';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#language-of-parts' , `ISACTIVE`='1' WHERE `id`='44';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#consistent-navigation' , `ISACTIVE`='1' WHERE `id`='51';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#consistent-identification' , `ISACTIVE`='1' WHERE `id`='52';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#error-suggestion' , `ISACTIVE`='1' WHERE `id`='56';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#error-prevention-legal-financial-data' , `ISACTIVE`='1' WHERE `id`='57';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#identify-input-purpose' , `ISACTIVE`='1' WHERE `id`='63';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#reflow' , `ISACTIVE`='1' WHERE `id`='65';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#non-text-contrast' , `ISACTIVE`='1' WHERE `id`='66';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#text-spacing' , `ISACTIVE`='1' WHERE `id`='67';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#status-messages' , `ISACTIVE`='1' WHERE `id`='78';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#orientation' , `ISACTIVE`='1' WHERE `id`='62';
-- Level AAA criterions
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#sign-language-prerecorded' , `ISACTIVE`='1' WHERE `id`='7';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#extended-audio-description-prerecorded' , `ISACTIVE`='1' WHERE `id`='8';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#media-alternative-prerecorded' , `ISACTIVE`='1' WHERE `id`='9';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#audio-only-live' , `ISACTIVE`='1' WHERE `id`='10';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#contrast-enhanced' , `ISACTIVE`='1' WHERE `id`='19';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#low-or-no-background-audio' , `ISACTIVE`='1' WHERE `id`='20';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#visual-presentation' , `ISACTIVE`='1' WHERE `id`='21';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#images-of-text-no-exception' , `ISACTIVE`='1' WHERE `id`='22';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#keyboard-no-exception' , `ISACTIVE`='1' WHERE `id`='25';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#no-timing' , `ISACTIVE`='1' WHERE `id`='28';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#interruptions' , `ISACTIVE`='1' WHERE `id`='29';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#re-authenticating' , `ISACTIVE`='1' WHERE `id`='30';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#three-flashes' , `ISACTIVE`='1' WHERE `id`='32';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#location' , `ISACTIVE`='1' WHERE `id`='40';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#link-purpose-link-only' , `ISACTIVE`='1' WHERE `id`='41';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#section-headings' , `ISACTIVE`='1' WHERE `id`='42';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#unusual-words' , `ISACTIVE`='1' WHERE `id`='45';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#abbreviations' , `ISACTIVE`='1' WHERE `id`='46';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#reading-level' , `ISACTIVE`='1' WHERE `id`='47';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#pronunciation' , `ISACTIVE`='1' WHERE `id`='48';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#change-on-request' , `ISACTIVE`='1' WHERE `id`='53';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#help' , `ISACTIVE`='1' WHERE `id`='58';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#error-prevention-all' , `ISACTIVE`='1' WHERE `id`='59';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#identify-purpose' , `ISACTIVE`='1' WHERE `id`='64';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus' , `ISACTIVE`='1' WHERE `id`='68';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#timeouts' , `ISACTIVE`='1' WHERE `id`='70';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#animation-from-interactions' , `ISACTIVE`='1' WHERE `id`='71';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#target-size' , `ISACTIVE`='1' WHERE `id`='76';
UPDATE `DS_EAW`.`Criterions` SET `referenceLink`='https://www.w3.org/TR/WCAG21/#concurrent-input-mechanisms' , `ISACTIVE`='1' WHERE `id`='77';


INSERT INTO `DS_EAW`.`OperativeSystems` (`name`, `isActive`) VALUES 
('Windows 10', '1'),
('Ubuntu 18.04', '1'),
('MacOS', '10'),
('iOS 7', '1'),
('Android 8', '1');


INSERT INTO `DS_EAW`.`Devices` (`name`, `brand`, `version`, `operativeSystemId`, `isActive`) VALUES
('Computadora', 'Dell', 'Latitude 5480', 2, 1),
('Tablet', 'Lenovo', '10', 5, 1);


INSERT INTO `DS_EAW`.`OperativeSystemsByDevices` (`devicesId`, `operativeSystemsId`) VALUES 
('1', '1'),
('1', '2'),
('1', '3'),
('2', '4'),
('2', '5');


INSERT INTO `DS_EAW`.`Disabilities` (`name`, `isActive`) VALUES
('Ceguera Total', '1'),
('Baja Visión', '1'),
('Auditiva', '1'),
('Cognitiva', '1'),
('Motora', '1');


INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES
-- 1 Ceguera Total - 2 Baja Visión - 3 Auditiva - 4 Cognitiva - 5 Motora
('1',1), ('2',1), ('3',1), ('4',2), -- 1.1.1 cognitivo por los capchas
('1',2), ('2',2), ('3',2), -- 1.2.1
('2',3), ('3',3), ('4',3), -- 1.2.2
('1',4), ('2',4), -- 1.2.3
('2',5), ('3',5), ('4',5), -- 1.2.4
('1',6), ('2',6), ('4',6), -- 1.2.5
('2',7), ('3',7), -- 1.2.6
('1',8), ('2',8), ('4',8), -- 1.2.7
('1',9), ('2',9), ('3',9), -- 1.2.8
('2',10),('3',10),  -- 1.2.9
('1',11), ('2',11), ('3',11), -- 1.3.1
('1',12), ('2',12), -- 1.3.2
('1',13), ('2',13), -- 1.3.3
('1',14), ('2',14), ('3',14), -- 1.4.1
('1',15), ('2',15), -- 1.4.2
('2',16), -- 1.4.3
('2',17), -- 1.4.4
('2',18), ('4',18), -- 1.4.5
('2',19), -- 1.4.6
('1',20), ('2',20), ('3',20), -- 1.4.7
('2',21), ('4',21), -- 1.4.8
('2',22), ('4',22), -- 1.4.9
('1',23), ('2',23), ('5',23), -- 2.1.1
('1',24), ('2',24), ('5',24), -- 2.1.2
('1',25), ('2',25), ('5',25), -- 2.1.3
('3',26), ('4',26), ('5',26), -- 2.2.1
('4',27), -- 2.2.2
('1',28), ('2',28), ('3',28), ('4',28), ('5',28), -- 2.2.3
('1',29), ('2',29), ('4',29), -- 2.2.4
('1',30), ('2',30), ('4',30), -- 2.2.5
('2',31), ('3',31), ('4',31), ('5',31), -- 2.3.1
('2',32), ('3',32), ('4',32), ('5',32), -- 2.3.2
('1',33), ('2',33), ('4',33), -- 2.4.1
('1',34), ('2',34), ('4',34), -- 2.4.2
('1',35), ('2',35), ('4',35), ('5',35), -- 2.4.3
('1',36), ('2',36), ('4',36), ('5',36), -- 2.4.4
('1',37), ('2',37), ('4',37), -- 2.4.5
('1',38), ('2',38), ('4',38), -- 2.4.6
('1',39), ('2',39), ('4',39), ('5',39), -- 2.4.7
('1',40), ('2',40), ('3',40), ('4',40), -- 2.4.8
('1',41), ('2',41), ('4',41), ('5',41), -- 2.4.9
('1',42), ('2',42), ('4',42), -- 2.4.10
('1',43), ('2',43), ('4',43), -- 3.1.1
('1',44), ('2',44), ('4',44), -- 3.1.2
('1',45), ('2',45), ('4',45), -- 3.1.3
('1',46), ('2',46), ('4',46), -- 3.1.4
('1',47), ('2',47), ('3',47), ('4',47), ('5',47), -- 3.1.5
('1',48), ('2',48), ('4',48), -- 3.1.6
('1',49), ('2',49), ('4',49), ('5',49), -- 3.2.1
('1',50), ('2',50), ('4',50), -- 3.2.2
('1',51), ('2',51), ('4',51), -- 3.2.3
('1',52), ('2',52), ('4',52), -- 3.2.4
('1',53), ('2',53), ('4',53), -- 3.2.5
('1',54), ('2',54), ('3',54), ('4',54), ('5',54), -- 3.3.1
('1',55), ('2',55), ('4',55), -- 3.3.2
('1',56), ('2',56), ('4',56), -- 3.3.3
('1',57), ('2',57), ('3',57), ('4',57), ('5',57), -- 3.3.4
('1',58), ('2',58), ('3',58), ('4',58), ('5',58), -- 3.3.5
('1',59), ('2',59), ('3',59), ('4',59), ('5',59), -- 3.3.6
('1',60), ('2',60), -- 4.1.1
('1',61), ('2',61), ('5',61), -- 4.1.2
('2',62), ('3',62), ('4',62), ('5',62), -- 1.3.4
('1',63), ('2',63), ('4',63), -- 1.3.5
('1',64), ('2',64), ('4',64), -- 1.3.6
('2',65), ('4',65), ('5',65), -- 1.4.10
('2',66), ('4',66), -- 1.4.11
('2',67), ('4',67), -- 1.4.12
('1',68), ('2',68), ('3',68), ('4',68), -- 1.4.13
('1',69), ('2',69), ('3',69), ('4',69), ('5',69), -- 2.1.4
('1',70), ('2',70), ('3',70), ('4',70), ('5',70), -- 2.2.6
('1',71), ('2',71), ('3',71), ('4',71), ('5',71), -- 2.3.3
('1',72), ('2',72), ('3',72), ('4',72), ('5',72), -- 2.5.1
('3',73), ('4',73), ('5',73), -- 2.5.2
('1',74), ('2',74), ('3',74), ('4',74), ('5',74), -- 2.5.3
('2',75), ('3',75), ('4',75), ('5',75), -- 2.5.4
('2',76), ('3',76), ('4',76), ('5',76), -- 2.5.5
('2',77), ('3',77), ('4',77), ('5',77), -- 2.5.6
('1',78), ('2',78), ('3',78), ('4',78), ('5',78); -- 4.1.3


INSERT INTO `DS_EAW`.`Languages` (`name`, `iana`) VALUES 
('Español', 'es'), 
('English', 'en');


INSERT INTO `DS_EAW`.`Notices` (`description`) VALUES 
('Revise que el texto alternativo de cada imágen, botón, encabezado, títulos, textos de enlace, etiquetas y entradas de formularios describen e identifican el propósito de cada elemento de forma que sean entendibles para el usuario.'),
('Si una imagen no se puede describir con  un texto alternativo corto, verificar si en la alternativa de texto existe un enlace a donde se especifique a detalle  el contenido de imagen.'),
('Cuando se brinden indicaciones para comprender el contenido, no confíe únicamente en las características sensoriales (como la forma, el tamaño o la ubicación) para describir los objetos.'),
('Revise que haya un mecanismo disponible para identificar definiciones específicas de palabras o frases utilizadas de forma inusual, modismos, jergas y abreviaturas. Si se requiere una capacidad de lectura superior a secundaria, se recomienda brindar un texto complementario o una versión alternativa.'),
('Recomendamos colocar un mecanismo, en la página web o el navegador, para que el usuario seleccione los colores de primer plano y de fondo para los bloques de texto.'),
('Los textos deben poder redimensionarse sin tecnología de asistencia hasta un 200 por ciento sin pérdida de contenido o funcionalidad.'),
('Revise que el ancho de un bloque de texto no exceda 80 caracteres (40 en escritura china, japonesa o coreana) o exista un mecanismo para reducir dicho acho.'),
('Se recomienda que el espacio entre párrafos sea al menos 1.5 veces el espacio entre líneas, o que haya un mecanismo disponible para lograrlo.'),
('Revise que los bloques de texto no estén completamente justificados, es decir, que el texto se justifique con respecto al borde izquierdo o derecho, o que exista un mecanismo para eliminar la justificación completa.'),
('Revise que si las imágenes sólo se usan con fines decorativos, o utilizadas sólo para formato visual, estas sean ignoradas por la tecnología asistiva de lectura.'),
('Si un elemento web contiene audio que se reproduce automáticamente durante más de 3 segundos, compruebe que existe la posibilidad de pausar, detener o silenciar el audio.'),
('Si hay contenido de audio pregrabado que es principalmente el habla (como la narración), los sonidos de fondo deben ser mutables, o ser al menos 20 dB (Aproximadamente 4 veces más silenciosos) que el habla.'),
('Revise que los eventos y funcionalidades del ratón estén disponibles a través del teclado: doble clic, mouse encima (evento "focus"), mouse afuera (evento "unFocus"), mouse sobre (evento "hover"), mantener click, soltar el click luego de presionarlo'),
('Se recomienda que ningún contenido parpadee más de tres veces en un período de 1 segundo; y haya un mecanismo disponible para detener el elemento parpadeante en menos de cinco segundos.'),
('Revise que el tiempo no sea una parte esencial de una actividad presentada por el contenido, excepto por medios sincronizados no interactivos y los eventos en tiempo real.'),
('Compruebe que todas las interrupciones (incluidas las actualizaciones de contenido) pueden ser aplazadas o suprimidas por el usuario, excepto las interrupciones relacionadas con una emergencia.'),
('En la programación web, compruebe que el orden de tabulación especificado por los atributos de tabindex sigue las relaciones en el contenido.'),
('Mantener el foco en un campo de entrada no debe producir un cambio de contexto.'),
('Revise que cualquier cambio en el idioma esté marcado con el atributo lang y / o xml: lang en un elemento, según corresponda.');


INSERT INTO `DS_EAW`.`Tags` (`name`) VALUES 
('Educación'),
('otros');


INSERT INTO `DS_EAW`.`RoleTypes` (`roleType`) VALUES
('Super Administrador'),
('Promotor'),
('Evaluador'),
('Cliente Directo');


INSERT INTO `DS_EAW`.`Packages` (`name`, `isActive`) VALUES
("Automático aleatorio", '1'),
("Automático específico", '1'),
("Manual específico", '1'),
("Completo aleatorio", '1');


INSERT INTO `DS_EAW`.`Rules` (`ruleName`) VALUES
( "Ejecutar automático" ),
( "Ejecutar manual" ),
( "Selección específica"),
( "Selección aleatoria" );


INSERT INTO `DS_EAW`.`RulesPackages` (`packagesId`, `rulesId`) VALUES
('1', '1'), -- auto
('1', '4'), -- aleatorio
('2', '1'), -- auto
('2', '3'), -- espec
('3', '2'), -- manual
('3', '3'), -- espec
('4', '1'), -- auto
('4', '2'), -- manual
('4', '4'); -- aleatorio


INSERT INTO `DS_EAW`.`Segments` (`name`, `isActive`, `countryId`) VALUES
('Legislativo', '1', '48'),
('Ejecutivo', '1', '48'),
('Judicial', '1', '48'),
('Electoral', '1', '48'),
('Instituciones Adscritas', '1', '48'),
('Instituciones autónomas ' , '1', '48'),
('Instituciones Semiautónomas', '1', '48'),
('Empresas Públicas Estatales', '1', '48'),
('Empresas Públicas No Estatales', '1', '48'),
('Entes Públicas No Estatales', '1', '48'),
('Municipalidades y Gobiernos Locales', '1', '48'),
('Instituciones Autónomas', '1', '48'),
('Otro', '1', '48');


INSERT INTO `DS_EAW`.`Recommendations` (`criterionsId`, `descriptionRecommendation`) VALUES
(1, 'El elemento Img no contiene texto alternativo. La etiqueta alt debe describir el propósito del enlace.'), 
(1, 'El elemento Img no tiene el atributo alt. Use el atributo alt para especificar una alternativa de texto breve.'), 
(1, 'El elemento Img presenta texto alternativo vacío, además el atributo títle está ausente o vacío.'), 
(1, 'El elemento Img está marcado para que la tecnología de asistencia lo ignore.'), 
(1, 'Asegúrese de que el texto alternativo del elemento img tenga el mismo propósito y presente la misma información que la imagen.'), 
(1, 'A la imagen del botón submit le falta un atributo alt. Especifique una alternativa de texto que describa la función del botón, utilizando el atributo alt.'), 
(1, 'Asegúrese de que el texto alternativo de la imagen del botón submit identifica el propósito del botón.'), 
(1, 'Al elemento de área en la imagen mapa le falta un atributo alt. Use el atributo alt para describir el área en el mapa.'), 
(1, 'Asegúrese de que la alternativa de texto del elemento de área en el mapa tenga el mismo propósito que la parte de la imagen del mapa a la que hace referencia.'), 
(1, 'Si esta imagen no se puede describir completamente en una alternativa de texto corto, asegúrese de que también esté disponible una alternativa de texto largo, ya sea en con texto en el body o mediante un enlace.'), 
(1, 'El elemento Img dentro de un enlace no debe ser el mismo que el texto del enlace. Considere combinar la descripción de la imagen con el enlace.'), 
(1, 'El elemento Img dentro de un enlace tiene texto alternativo vacío o faltante. Considere combinar el texto del enlace con la descripción de la imagen.'), 
(1, 'El elemento Img dentro de un enlace no debe usar texto alternativo que duplique el contenido de un enlace de texto junto a él.'), 
(1, 'Los elementos Object deben contener una alternativa de texto después de que se hayan agotado todas las demás alternativas.'), 
(1, 'Verifique que las alternativas de texto estén disponibles para contenido que no sea de texto y que tengan el mismo propósito y presenten la misma información.'), 
(1, 'Los elementos applet deben contener una alternativa de texto en el cuerpo del elemento, para navegadores sin soporte para el elemento applet.'), 
(1, 'Los elementos del applet deben contener un atributo alt, para proporcionar una alternativa de texto a los navegadores que admiten el elemento pero no pueden cargar el applet.'), 
(1, 'Verifique que las alternativas de texto estén disponibles para contenido que no sea de texto y que tengan el mismo propósito y presenten la misma información.'), 
(2, 'Si este objeto incrustado contiene audio pregrabado verifique que haya disponible una versión alternativa de texto.'), 
(2, 'Si este objeto incrustado contiene video pregrabado, verifique que esté disponible una versión alternativa de texto o que se proporcione una pista de audio que presente información equivalente.'), 
(3, 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcionen subtítulos para el contenido de audio.'), 
(4, 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una descripción de audio de su video y / o una versión alternativa de texto del contenido.'), 
(5, 'Si este objeto incrustado contiene medios sincronizados, verifique que se proporcionen subtítulos para el contenido de audio en vivo.'), 
(6, 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una descripción de audio para su contenido de video.'), 
(7, 'Si este objeto incrustado contiene medios sincronizados pregrabados, verifique que se proporcione una interpretación en lenguaje de señas para su audio.'), 
(8, 'Si este objeto incrustado contiene medios sincronizados, y cuando las pausas en el audio en primer plano no son suficientes para permitir que las descripciones de audio transmitan la sensación de video pregrabado, verifique que se proporcione una descripción de audio extendida, ya sea a través de secuencias de comandos o una versión alternativa.'), 
(9, 'Si este objeto incrustado contiene medios sincronizados pregrabados o contenido solo de video, verifique que se proporcione una versión alternativa de texto del contenido.'), 
(10, 'Si este objeto incrustado contiene contenido de solo audio en vivo, verifique que se proporcione una versión de texto alternativa del contenido.'), 
(11, 'El rol de este elemento es "presentation" pero contiene elementos secundarios con significado semántico. Compruebe si el elemento transmite información, estructura o relaciones a través del marcado semántico.'), 
(11, 'El atributo "for" de esta etiqueta contiene un id que no existe en el documento.'), 
(11, 'El atributo "for" de esta etiqueta contiene un id que no existe en el fragmento de documento.'), 
(11, 'El atributo "for" de esta etiqueta contiene un id que apunta a un elemento que no es un control (input, textarea, ..., ) de formulario.'), 
(11, 'Compruebe que el atributo "title" identifica el propósito del control y que un elemento de etiqueta no es apropiado.'), 
(11, 'Este control de formulario tiene un atributo "aria-label" que está vacío o solo contiene espacios. Se ignorará para fines de prueba de etiquetado.'), 
(11, 'Este control de formulario contiene un atributo aria-labelledby, sin embargo, incluye una ID "{{id}}" que no existe en un elemento. El atributo aria-labelledby se ignorará para fines de prueba de etiquetado.'), 
(11, 'Este campo de formulario oculto está etiquetado de alguna manera. No debería haber ninguna necesidad de etiquetar un campo de formulario oculto.'), 
(11, 'Este campo de formulario está diseñado para ocultarse (usando el atributo "oculto pero también está etiquetado de alguna manera. No debería haber ninguna necesidad de etiquetar un campo de formulario oculto.'), 
(11, 'Este campo de formulario debe estar etiquetado de alguna manera. Utilice el elemento de etiqueta (ya sea con un atributo "for" o encapsulado en un form field), o los atributos "title", "aria-label" o "aria-labelledby" según corresponda.'), 
(11, 'Revise que el "marcado semántico" de HTML ("em", "strong", "cite"...) se utiliza para enfatizar texto especial y pueda ser identificado programáticamente.'), 
(11, 'Revise que el "marcado semántico" de HTML se utiliza para enfatizar texto. Ejemplo: utilizar "text-align" en párrafos y otros tipos de textos.'), 
(11, 'Revise que el "marcado semántico" de HTML ("em", "strong", "cite"...) se utiliza para enfatizar texto especial y pueda ser identificado programáticamente.'), 
(11, 'Revise que el "marcado semántico" de HTML ("em", "strong", "cite"...) se utiliza para enfatizar texto especial y pueda ser identificado programáticamente.'), 
(11, 'Revise si el elemento es un encabezado, si lo es, debe usar el marcado HTML de encabezados (h1, h2, ...).'), 
(11, 'La celda de la tabla no posee un atributo de alcance válido ("row", "col", "rowgroup", "colgroup").'), 
(11, 'Los elementos "td" en las tablas se encuentran obsoletos, se recomienda utilizar elementos "th" en su lugar.'), 
(11, 'Revise si los atributos son ambiguos en una tabla con múltiples niveles de encabezados. Se recomienda usar atributos encabezados en elementos "td" en su lugar.'), 
(11, 'El elemento "td" con un atributo de encabezado no coincide con el esperado de sus celdas de encabezado correspondientes.'), 
(11, 'La relación entre elementos "td" y el elemento "th" asociado no está definida. Si una tabla tiene variedad de niveles de elementos "th", se deben utilizar atributos de encabezado en elementos td.'), 
(11, 'No todos los elementos de esta tabla contienen un atributo id. Estas celdas deben contener ids para que los atributos de encabezados de los elementos de la td puedan hacer referencia a ellos.'), 
(11, 'No todos los elementos "td" en esta tabla contienen un atributo de encabezado. Se recomienda que cada atributo de encabezado debe enumerar los identificadores de todos los elementos "th" asociados con esa celda.'), 
(11, 'La relación entre los elementos "td" y sus elementos "th" asociados no está definida. Utilice el atributo de alcance en los elementos "th" o el atributo de encabezado en los elementos "td".'), 
(11, 'No todos los elementos de esta tabla tienen un atributo de alcance. Estas celdas deben contener un atributo de alcance para identificar su asociación con elementos td.'), 
(11, 'Parece que esta tabla se usa para el diseño, pero contiene un atributo de resumen. Las tablas de diseño no deben contener atributos de resumen o, si se suministran, deben estar vacías.'), 
(11, 'Si esta tabla es una tabla de datos, y presenta un atributo de resumen y un elmento de subtítulo, el resumen no debe ser igual que el subtítulo.'), 
(11, 'Si esta tabla es una tabla de datos, verifique que el atributo de resumen describe la organización de las tablas o explica cómo usar la tabla.'), 
(11, 'Si esta tabla es una tabla de datos, considere usar el atributo de resumen del elemento de la tabla para obtener una visión general de esta tabla.'), 
(11, 'Parece que esta tabla se usa para el diseño, pero contiene un elemento de título. Las tablas de diseño no deben contener títulos.'), 
(11, 'Si la tabla es una tabla de datos, revise si el elemento describe la tabla acertadamente.'), 
(11, 'Si la tabla es una tabla de datos, se recomienda colocar un subtítulo o "caption" en el elemento tabla para identificar esta tabla.'), 
(11, 'El elemento "Fieldset" no contiene un elemento de leyenda. Todos los conjuntos de campos deben contener un elemento de leyenda que describa una descripción del grupo de campos.'), 
(11, 'Si esta lista de selección contiene grupos de opciones relacionadas, deben agruparse con la etiqueta HTML "optgroup".'), 
(11, 'Los botones de radio o casillas de verificación con el mismo atributo de nombre deben estar contenidos dentro de un elemento HTML "fieldset".'), 
(11, 'El contenido parece tener la apariencia visual de una lista con viñetas. Puede ser apropiado marcar este contenido usando un elemento "ul".'), 
(11, 'El contenido parece tener la apariencia visual de una lista numerada. Puede ser apropiado marcar este contenido usando un elemento "ol".'), 
(11, 'Los encabezados no cumplen un orden lógico. Se recomienda que el encabezado primario sea un "h1" y de la misma forma seguir el orden lógico sin saltar numeraciones.'), 
(11, 'Los encabezados no cumplen un orden lógico. Se recomienda que el encabezado primario sea un "h1" y de la misma forma seguir el orden lógico sin saltar numeraciones.'), 
(11, 'Etiqueta de encabezado encontrada sin contenido. Se debe especificar un encabezado, no pretender que texto sin etiquetas de encabezados representen un encabezado.'), 
(11, 'Si este elemento contiene una sección de navegación, se recomienda que se marque como una lista.'), 
(11, 'Esta tabla parece ser una tabla de diseño. Si se pretende que sea una tabla de datos, asegúrese de que las celdas de encabezado se identifiquen utilizando los elementos.'), 
(11, 'Esta tabla parece ser una tabla de datos. Si se pretende que sea una tabla de diseño, asegúrese de que no haya elementos th, ni resumen o título.'), 
(12, 'Compruebe que el contenido se ordena en una secuencia significativa cuando se linealiza, como cuando las hojas de estilo están deshabilitadas.'), 
(13, 'Cuando se proporcionan instrucciones para comprender el contenido, no confíe solo en las características sensoriales (como la forma, el tamaño o la ubicación) para describir los objetos.'), 
(14, 'Verifique que cualquier información transmitida usando solo el color también esté disponible en el texto, o mediante otras indicaciones visuales.'), 
(15, 'Si algún audio se reproduce automáticamente durante más de 3 segundos, compruebe que existe la posibilidad de pausar, detener o silenciar el audio.'), 
(16, 'Compruebe que este elemento tenga un color de primer plano heredado para complementar el color de fondo o imagen de fondo correspondiente.'), 
(16, 'Compruebe que este elemento tenga un color de fondo heredado para complementar el color o imagen de primer plano correspondiente.'), 
(16, 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sea de al menos 4.5: 1.'), 
(16, 'El texto de este elemento se coloca en una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sea de al menos 4.5: 1.'), 
(16, 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'), 
(16, 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sean de al menos 3: 1.'), 
(16, 'El texto o el fondo de este elemento contiene transparencia. Asegúrese de que la relación de contraste entre el texto y el fondo sea de al menos 4.5: 1.'), 
(16, 'Este elemento tiene un contraste insuficiente en este nivel de conformidad.'), 
(17, 'Compruebe que el texto se puede cambiar de tamaño sin tecnología de asistencia hasta un 200 por ciento sin pérdida de contenido o funcionalidad.'), 
(18, 'Si las tecnologías que se usan pueden lograr la presentación visual, verifique que el texto se use para transmitir información en lugar de imágenes de texto, excepto cuando la imagen de texto es esencial para la información que se transmite o puede personalizarse visualmente según los requisitos del usuario'), 
(19, 'Este elemento está en una posición absoluta y no se puede determinar el color de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas del fondo sean de al menos 3: 1.'), 
(19, 'El texto de este elemento se coloca sobre una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'), 
(19, 'Este elemento tiene un contraste insuficiente en este nivel de conformidad. Se esperaba una relación de contraste de al menos 4.5: 1.'), 
(19, 'Este elemento tiene un contraste insuficiente en este nivel de conformidad.'), 
(19, 'Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'), 
(19, 'El texto de este elemento se coloca sobre una imagen de fondo. Asegúrese de que la relación de contraste entre el texto y todas las partes cubiertas de la imagen sean al menos 4.5: 1.'), 
(20, 'Si hay contenido de audio pregrabado que es principalmente el habla (como la narración), los sonidos de fondo deben ser mutables, o ser al menos 20 dB (Aproximadamente 4 veces más silenciosos) que el habla.'), 
(21, 'Verifique que haya un mecanismo disponible para que el usuario seleccione los colores de primer plano y de fondo para los bloques de texto, ya sea a través de la página web o del navegador.'), 
(21, 'Verifique que exista un mecanismo para reducir el ancho de un bloque de texto a no más de 80 caracteres (o 40 en escritura china, japonesa o coreana).'), 
(21, 'Verifique que los bloques de texto no estén completamente justificados, es decir, en los bordes izquierdo y derecho, o que exista un mecanismo para eliminar la justificación completa.'), 
(21, 'Verifique que el espaciado entre líneas en bloques de texto sea al menos 150 por ciento en los párrafos, y que el espaciado entre párrafos sea al menos 1.5 veces el espaciado entre líneas, o que haya un mecanismo disponible para lograr esto.'), 
(21, 'Compruebe que el texto se puede redimensionar sin tecnología de asistencia hasta un 200 por ciento sin que el usuario se desplace horizontalmente en una ventana de pantalla completa.'), 
(22, 'Compruebe que las imágenes de texto solo se usan para decoración pura o donde una presentación particular de texto es esencial para la información que se transmite.'), 
(23, 'Asegúrese de que la funcionalidad proporcionada por un controlador de eventos para este elemento esté disponible a través del teclado'), 
(23, 'Revise que la funcionalidad "doble click" y eventos del ratón estén disponibles a través del teclado.'), 
(23, 'Revise que la funcionalidad "mouse encima" (evento "focus") y eventos del ratón estén disponibles a través del teclado.'), 
(23, 'Revise que la funcionalidad "mouse afuera" (evento "unFocus") y eventos del ratón estén disponibles a través del teclado.'), 
(23, 'Revise que la funcionalidad "mouse sobre" (evento "hover") y eventos del ratón estén disponibles a través del teclado.'), 
(23, 'Asegúrese de que la funcionalidad que se proporciona al presionar el mouse sobre este elemento está disponible a través del teclado; por ejemplo, mediante el evento keydown.'), 
(23, 'Revise que la funcionalidad "soltar el click luego de presionar" y eventos del ratón estén disponibles a través del teclado.'), 
(24, 'Compruebe que este applet o complemento proporciona la capacidad de alejar el foco de sí mismo cuando usa el teclado.'), 
(26, 'Meta etiqueta de actualización utilizada para redirigir a otra página, con un límite de tiempo que no es cero. Se recomienda que no se creen cambios de contexto que pueden interrumpir al usuario. Es aceptable utilizar el "meta" elemento si el tiempo de espera para redireccionar es de 0 segundos.'), 
(26, 'Si hay una "meta" etiqueta de actualización utilizada para actualizar la página actual. Los usuarios no pueden controlar el límite de tiempo para esta actualización. Se recomienda evitar que la página se refresque inesperadamente.'), 
(27, 'Si alguna parte del contenido se mueve, se desplaza o parpadea durante más de 5 segundos, o se actualiza automáticamente, verifique que haya un mecanismo disponible para pausar, detener u ocultar el contenido.'), 
(27, 'Asegúrese de que haya un mecanismo disponible para detener este elemento parpadeante en menos de cinco segundos.'), 
(27, 'Los elementos de parpadeo no pueden satisfacer el requisito de que la información de parpadeo se pueda detener en cinco segundos.'), 
(28, 'Verifique que el tiempo no sea una parte esencial del evento o actividad presentada por el contenido, a excepción de los medios sincronizados no interactivos y los eventos en tiempo real.'), 
(29, 'Verifique que el usuario pueda posponer o quitar todas las interrupciones (incluidas las actualizaciones de contenido), a exlas interrupciones que involucren una emergencia.'), 
(30, 'Si la página web es parte de un conjunto de páginas web con un límite de tiempo de inactividad, verifique que un usuario autenticado pueda continuar la actividad sin pérdida de datos después de volver a autenticarse.'), 
(31, 'Verifique que ningún componente del contenido tenga un destello de más de tres veces en un período de 1 segundo, o que el tamaño de cualquier área de destello sea lo suficientemente pequeño.'), 
(32, 'Compruebe que ningún componente del contenido destelle más de tres veces en un período de 1 segundo.'), 
(33, 'Compruebe que el atributo título (title) de este elemento contiene texto que identifica el "frame".'), 
(33, 'Asegúrese de que cualquier elemento de navegación común se pueda omitir; por ejemplo, mediante el uso de enlaces de omisión, elementos de encabezado o roles de referencia de ARIA.'), 
(33, 'El elemento "iframe" requiere un atributo de título no vacío que identifica el "frame".'), 
(33, 'Hay un elemento frame que requiere un atributo "title" no vacío que lo identifique' ), 
(33, 'Este enlace apunta a un ancla con un nombre dentro del documento, pero no existe un ancla con ese nombre.'), 
(34, 'Se debe proporcionar un título para el documento, utilizando un elemento de título no vacío en la sección de encabezado.'), 
(34, 'El elemento de título en la sección de encabezado no debe estar vacío.'), 
(34, 'Si se usa "tabindex", verifique que el orden de tabulación especificado por los atributos del "tabindex" siga las relaciones en el contenido.'), 
(34, 'Verifique que el elemento del título describa el documento.'), 
(35, 'Si esta página web no es parte de un proceso lineal, verifique que haya más de una forma de ubicar esta página web dentro de un conjunto de páginas web.'), 
(36, 'Verifique que los títulos y las etiquetas describan el tema o el propósito.'), 
(36, 'Verifique que haya al menos un modo de operación donde el indicador de enfoque del teclado pueda ubicarse visualmente en los controles de la interfaz de usuario.'), 
(37, 'Los elementos de enlace solo pueden ubicarse en la sección del encabezado del documento.'), 
(38, 'Al elemento de enlace le falta el atributo "rel" no vacío que identifica el tipo de enlace.'), 
(39, 'Al elemento de enlace le falta el atributo "href" no vacío que apunta al recurso que se está vinculando.'), 
(40, 'Revise que el texto del enlace describa el propósito del enlace.'), 
(40, 'Al elemento de enlace le falta un atributo rel no vacío que identifica el tipo de enlace.'), 
(40, 'El HTML debe tener un atributo "lang" o "xml: lang" que describa el idioma del documento.'), 
(41, 'El lenguaje especificado en el atributo "lang" del elemento del documento no parece estar bien formado. Ejemplos aceptados son: "es", "en" y otros.'), 
(42, 'El lenguaje especificado en el atributo "xml: lang" del elemento del documento no parece estar bien formado. Ejemplos aceptados son: "es", "en" y otros.'), 
(43, 'Asegúrese de que cualquier cambio en el idioma esté marcado con el atributo "lang" o "xml: lang", según corresponda.'), 
(43, 'El lenguaje especificado en el atributo "xml: lang" no parece bien formado. Ejemplo aceptado: lang="es"'), 
(43, 'El lenguaje especificado en el atributo "xml: lang" no parece bien formado. Ejemplo aceptado: xml:lang="es"'), 
(44, 'Revise que haya un mecanismo para acceder a definiciones de palabras inusuales, palabras restringidas, modismos y jerga.'), 
(44, 'Revise que sea posible acceder a la forma expandida o significado de las abreviaciones.'), 
(44, 'Cuando el contenido requiere capacidad de lectura más avanzada que el nivel de educación secundaria inferior (en Costa Rica, primeros años de colegio), se debe proporcionar contenido complementario o una versión alternativa.'), 
(45, 'El elemento Ruby no contiene un elemento rt con información de pronunciación para el texto del cuerpo.'), 
(46, 'El elemento Ruby no contiene un elemento rt con información de pronunciación para el texto dentro del elemento rb.'), 
(47, 'El elemento "ruby" no contiene elementos rp, los cuales mejoran el formato de caracteres para navgadores que no soportan el texto tipo "ruby".'), 
(48, 'Compruebe que no se produce un cambio de contexto cuando cualquier campo de entrada recibe el foco.'), 
(48, 'El form no contiene un botón para enviar la información. Recomendación: Colocar el atributo "input type" con el valor "submit" o "image" o un botón de tipo "submit".'), 
(48, 'Compruebe que los mecanismos de navegación que se repiten en varias páginas web se producen en el mismo orden relativo cada vez que se repiten, a menos que el usuario inicie un cambio.'), 
(49, 'Verifique que los componentes que tienen la misma funcionalidad dentro de esta página web se identifiquen consistentemente en el conjunto de páginas web a las que pertenece.'), 
(50, 'Compruebe que si un enlace se abrirá en una ventana nueva, este contiene información que indique dicha acción.'), 
(51, 'Revise que si se detecta un error de entrada en el formulario, este error sea descrito para el usuario en texto.'), 
(52, 'Compruebe que se proporcionan etiquetas o instrucciones descriptivas (incluidos los campos obligatorios) para la entrada del usuario en este formulario.'), 
(53, 'Compruebe que este formulario sugiere correcciones a los errores en la entrada del usuario, a menos que ponga en peligro la seguridad o el propósito del contenido.'), 
(54, 'Si este formulario obliga a un usuario a un compromiso legal, modificaría o eliminaría datos controlables por el usuario o enviaría respuestas de prueba, asegúrese de que los envíos sean reversibles, verificados por errores de entrada y / o confirmados por el usuario.'), 
(55, 'Verifique que la ayuda contextual esté disponible para este formulario, a nivel de página web o haya un mecanismo de control.'), 
(56, 'Revise que los envios de datos al formulario sean reversibles, controlados por errores en entradas, y confirmados por el usuario.'), 
(57, 'El valor del id de el elemento se encuentra duplicado.'), 
(58, 'El elemento no tiene un nombre disponible para una API de accesibilidad. Reomendaciones: "alt" y "title" para imágenes, texto dentro del marcado "button", elemento asociado a un atrinuto "title", atributos "aria-label" o "aria-labelledby" para entradas de texto, texto dentro de un atributo "fieldset" y el atributo "value" en botones.'), 
(59, 'Revise que los envios de datos al formulario sean reversibles, controlados por errores en entradas, y confirmados por el usuario. '), 
(60, 'El valor del id de el elemento se encuentra duplicado.'), 
(61, 'Elemento de anclaje "a" que contiene un ID pero sin un "href" o texto de enlace, considere mover dicho ID a un elemento primario o cercano, sino, se evita el rol elemento cumpla su rol de enlace. Lo anterior no aplica en la version 4.01 de HTML (Lenguaje de Marcas de Hipertexto). '), 
(61, 'Elemento de anclaje "a" tiene un atributo de nombre, pero sin "href" o texto de enlace. Considere mover el atributo de nombre para convertirse en un ID de un elemento primario o cercano.'), 
(61, 'Se encuentra un elemento de anclaje "a" sin contenido de tipo link, nombre y atributo ID.'), 
(61, 'Los elementos de anclaje que no deberían ser usados para definir objetivos de enlace en la página, excepto si se utiliza el ID para otros fines (como CSS o secuencias de comandos), considere moverl el ID a un elemento principal.'), 
(61, 'Se encuentra un elemento de anclaje que tiene contenido de tipo link, pero sin "href" y o atributo ID.'), 
(61, 'Se encuentra un elemento de anclaje que tiene un atributo "href" válido, pero sin contenido de enlace.'), 
(61, 'Elemento de anclaje encontrado sin contenido de enlace y sin nombre y / o atributo ID.'), 
(25, 'Toda la funcionalidad del contenido es operable a través de una interfaz de teclado sin requerir tiempos específicos para las pulsaciones de teclas individuales.'), 
(1, 'Algunos gráficos deberían de tener una mejor descripción mediante textos alternativos.'), 
(38, 'Se recomienda etiquetar títulos y subtítulos en encabezados, verifique que los encabezados estén marcados utilizando atributos del mismo tipo que "h1", "h2", etc.'), 
(62, 'Se recomienda tener la opción “Show / Hide” para permitir el acceso a contenido en diferentes orientaciones de pantalla.'), 
(63, 'Se recomienda usar opciones de auto-relleno, de forma que el usuario no tenga que recordar todo.'), 
(63, 'Se recomienda utilizar iconos representativos para que el ingreso de datos se entienda visualmente. Como un teléfono en el input del número telefónico.'), 
(64, 'Verifique que se puedan determinar regiones, la principal, encabezados y todas las demás. Les llaman "Landmarks". Ejemplo de "Landmarks": "banner", "main", etc'), 
(65, 'Al cambiar el tamaño de la pantalla, se deben mantener las dimensiones del texto e imágenes. De forma que si hay varias columnas, al realizar zoom, pueden haber menos columnas para mantener el radio de visión.'), 
(65, 'En un reflow o redimensión, se deben mantener los toolbars o barras de herramientas accesibles para el usuario.'), 
(66, 'El radio de contraste debe ser 3:1. Debe haber algo que contraste los elementos que no sean textos y los textos que los acompañan. Ejemplo: Una entrada de texto debe ser visible al lado de la etiqueta. Otro ejemplo: la distinción de un texto que es un link o hipervínculo.'), 
(67, 'El texto cabe en cajas contenedoras sin ser cortado o si traslapar otros textos.'), 
(68, 'Hay un contenido de ayuda que se puede mostrar con colocar el mouse encima o con una tecla. El texto de ayuda no debe afectar el contenido.'), 
(68, 'El contenido de ayuda debe poder quitarse o ponerse con una tecla como Exit o seleccionando un botón de cerrar.'), 
(68, 'Si un usuario incrementa el tamaño del cursor mediante la configuración en la plataforma, igual debe poder ver el contenido flotante oscurecido (hover). Recomendación: En css utilizar efecto "hover" y pseudo clases "focus", además los "tootlip" de ARIA (Aplicaciones de Internet enriquecidas accesibles).'), 
(69, 'Para los "shortcuts" o atajos del teclado, verifique que se cumpla al menos una de las siguientes tres cosas: Hay una forma de apagar los “shortcuts”, tiene un mecanismo para remapear cada atajo para usar uno o más teclas que no imprimen (Alt, Ctrl, …), un conjunto de shorcuts o atajos se habilitan por componente ( solo están activos en el componente que esté enfocado ). Ej: Que hayan algunos en la pagina principal.'), 
(70, 'Verifique guardar datos del usuario por al menos 20 horas de inactividad, si estos datos afectan la funcionalidad del sistema para dicho usuario. Además, al inicio, verifique brindarle al usuario una advertencia de la duración de almacenamiento por inactividad.'), 
(71, 'Pueden deshabilitarse las animaciones globalmente, a menos de que estas sean esenciales. Animaciones como “parallax” al bajar con el "scroll" o rueda del mouse. Recomendación: Utilizar "CSS Media Query" para permitir al usuario reduir el movimiento de la página'), 
(72, 'Mayormente en pantallas táctiles, las funcionalidades que usen multiples puntos a la vez, deben poder realizarse con un solo puntero (dedo, lápiz, etc), a menos que sea estrictamente necesario utilizar más de un punto.'), 
(73, 'Al presionar el click, se produce un “down event” (el click se encuentra presionado), este evento NO debe tener función, la funcionalidad del sistema se debe dar al soltar el click. Recomendación: Utilizar el evento "key up".'), 
(74, 'El nombre accesible es incluir un label en los componentes de la interfaz que incluyan texto o imágenes de texto. Este nombre contiene texto que se presenta visualmente. '), 
(75, 'Verifique que las funcionalidades pueden utilizarse mediante “device motion” o gestos y movimiento, así como con controles disponibles en la interfaz. Esta opción se utiliza mayormente en dispositivos móviles.'), 
(76, 'El tamaño del área para puntear o hacer click es de al menos 44x44 CSS pixeles, excepto cuando: Hay otro link equivalente que lleva a lo mismo, el objetivo está en medio de un texto, el tamaño del objetivo es definido por el usuario. Ejemplo: botones, un ícono de ayuda, un link de texto en un párrafo.'), 
(77, 'Verifique si es necesario restringir métodos de entrada simultáneos, por motivos de seguridad o por respetar la configuración del usuario.'), 
(78, 'Verifique si el cambio en el estado de alguna parte de la página se ve reflejado para ser una asistencia. Ejemplo: Al presionar el botón de búsqueda se muestra un mensaje con la cantidad de resultados encontrados.');

INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,1);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,2);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,3);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,4);  
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,5);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,6);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,7);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,8);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,9);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,10);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,11);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,12);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,13);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,14);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,15);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,16);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,17);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,18);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,19);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,20);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,21);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,22);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,23);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,24);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,25);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,26);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,27);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,28);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,29);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,30);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,31);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,32);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,33);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,34);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,35);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,36);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,37);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,38);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,39);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,40);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,41);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,42);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,43);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,44);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,45);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,46);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,47);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,48);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,49);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,50);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,51);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,52);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,53);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,54);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,55);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,56);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,57);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,58);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,59);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,60);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,61);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,62);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,63);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,64);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,65);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,66);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,67);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,68);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,69);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,70);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,71);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,72);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,73);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,74);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,75);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,76);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,77);
INSERT INTO DS_EAW.Recommendations (descriptionRecommendation, alternativeRecomendationCode, criterionsId) VALUES ('Revisar recomendaciones', null,78);


INSERT INTO `DS_EAW`.`SupportTools` (`name`, `version`, `isActive`) VALUES 
('NVDA', '2019.3.1', 1),
('JAWS', null, 1),
('Orca', null, 1),
('VoiceOver', null, 1),
('Alto contraste', null, 1),
('Magnificador', null, 1);

UPDATE `DS_EAW`.`Principles` SET `descriptionPath` = 'utils.principles.perceivable' WHERE (`id` = '1');
UPDATE `DS_EAW`.`Principles` SET `descriptionPath` = 'utils.principles.operable' WHERE (`id` = '2');
UPDATE `DS_EAW`.`Principles` SET `descriptionPath` = 'utils.principles.understandable' WHERE (`id` = '3');
UPDATE `DS_EAW`.`Principles` SET `descriptionPath` = 'utils.principles.robust' WHERE (`id` = '4');


insert into `DS_EAW`.`SupportToolsByDisabilities` (`supportToolId`, `disabilityId`) values
-- 1 Ceguera Total - 2 Baja Visión - 3 Auditiva - 4 Cognitiva - 5 Motora
(1,1), (1,2), (1,3), (1,4), (1,5),
(2,1), (2,2), (2,3), (2,4), (2,5),
(3,1), (3,2), (3,3), (3,4), (3,5),
(4,1), (4,2), (4,3), (4,4), (4,5),
(5,2), (5,3), (5,4), (5,5),
(6,2), (6,3), (6,4), (6,5);


INSERT INTO `DS_EAW`.`Users` (`firstName`, `lastName`, `email`, `password`, `roleTypesId`, `realm`, `username`, `emailVerified`, `isDeleted`, `telephone`, `languagesId`, `isActive`, `createdBy`) VALUES 
('Super Administrador', 'SA', 'otai@itcr.ac.cr', '$2a$10$2IlK0zzcqxwH2v3/qaXTOe0sSuEf/4RSgTCH7NvCXEG5dx7NNjfkK', '1', 'super', 'superadministrador@itcr.ac.cr', '1', '0', '25252525', '1', '1', NULL);


ALTER TABLE `DS_EAW`.`Criterions` 
ADD COLUMN `isEvaluatedByAutomatic` `isEvaluatedByAutomatic` TINYINT(1) NULL DEFAULT b'0' COMMENT 'Evaluated by pa11y 5.1.0.' ;

UPDATE `DS_EAW`.`Criterions` SET `isEvaluatedByAutomatic`= 1
	WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 48, 50, 51, 53, 54, 56, 60, 61, 62, 63, 65, 74, 75);


-- Add missin level A criterions for disabilties 1 and 2... and others
INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '27');
INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('3', '27');
INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('5', '27');

INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('1', '26');
INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '26');

INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('1', '73');
INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '73');

UPDATE `DS_EAW`.`Criterions` SET `criterionDescription`='Para cada límite de tiempo impuesto por el contenido, se cumple al menos uno de los siguientes casos. Ese tiempo límite se puede: \"Apagar\", \"Ajustar\" o \"Extender\"; excepto: En tiempo real, si es esencial, si son 20 horas o más.' WHERE `id`='26';


