'use strict';

const ReportGraphics = require('./graphics/report-graphics');
const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');

module.exports = function CustomTex() {
  this.getMetaData = reportTypeName => {
    try {
      let customPage = `
      \\documentclass{article}

      \\usepackage[utf8]{inputenc}
      \\usepackage{hyperref}
      \\usepackage{eso-pic,graphicx}
      \\usepackage{array}
      \\usepackage{tabulary}
      \\usepackage[top=3cm, bottom=2cm, outer=2cm, inner=2cm]{geometry}
      \\usepackage{fancyhdr}
      \\usepackage{ragged2e}
      \\usepackage{soul}
      \\usepackage{atbegshi}
      \\usepackage{titlesec}
      \\usepackage{longtable}
      \\usepackage[T1]{fontenc}
      \\usepackage{minted}
      \\usepackage{amsmath}
      \\usepackage{float}
      \\usepackage{pdfpages}
      \\usepackage{multirow}
      \\usepackage{hhline}
      \\usepackage{color}
      \\usepackage{colortbl}
      \\usepackage{fontspec} 
      \\usepackage{tikz}
      \\usepackage{alphalph}
      \\usepackage{enumitem}
      \\usepackage[font=normalsize]{caption}
      \\captionsetup[table]{name=Tabla}
      \\captionsetup[figure]{name=Gráfico}
      \\renewcommand{\\partname}{}
      \\renewcommand{\\thepart}{}
      
      %Url breakline
      \\gappto{\\UrlBreaks}{\\UrlOrds}
      
      \\AtBeginDocument{\\AtBeginShipoutNext{\\AtBeginShipoutDiscard}}
      \\usemintedstyle{tango}
      \\pagestyle{fancy}
      \\setmainfont{Lato}
      \\urlstyle{same}

      \\definecolor{ColorLightgray}{RGB}{201,201,201}
      \\definecolor{ColorPurple}{RGB}{102,0,154}

      \\newcommand\\hhcolorgray[1]{\\hhline{>{\\arrayrulecolor{ColorLightgray}}--->{\\arrayrulecolor{black}}}}
      \\newcommand\\hhcolorwhite[1]{\\hhline{~>{\\arrayrulecolor{ColorLightgray}}-->{\\arrayrulecolor{black}}}}
      \\newcommand{\\tikzcircle}[2][red,fill=red]{\\tikz[baseline=-0.5ex]\\draw[#1,radius=#2] (0,0) circle ;}
      \\renewcommand{\\headrulewidth}{0pt}

      \\fancyfoot{}
      \\renewcommand{\\footrulewidth}{0.3pt}
      
      \\renewcommand{\\footrule}{{\\color{gray}\\vskip-\\footruleskip\\vskip-\\footrulewidth \\hrule width\\headwidth height\\footrulewidth\\vskip\\footruleskip}}

      \\lfoot{ 
        {\\color[HTML]{377a81}
         {\\normalsize
          \\textit{${reportTypeName} de Accesibilidad Digital}
         }
        } 
      }
      \\rfoot{
        {\\color[HTML]{377a81} \\thepage}
      }
      
      \\newcommand\\invisiblesection[1]{%
      \\refstepcounter{section}%
      \\addcontentsline{toc}{section}{\\protect\\numberline{\\thesection}#1}%
      \\sectionmark{#1}}

      %Add one more sub section
      \\titleclass{\\subsubsubsection}{straight}[\\subsection]
      \\newcounter{subsubsubsection}[subsubsection]
      \\renewcommand\\thesubsubsubsection{\\alphalph{\\value{subsubsubsection}}. }
      \\renewcommand\\theparagraph{\\alphalph{\\value{paragraph}}}

      \\titleformat{\\subsubsubsection}
        {\\normalfont\\normalsize\\bfseries}{\\thesubsubsubsection}{1em}{}
      \\titlespacing*{\\subsubsubsection}
      {0pt}{3.25ex plus 1ex minus .2ex}{1.5ex plus .2ex}

      \\makeatletter
      \\renewcommand\\paragraph{\\@startsection{paragraph}{5}{\\z@}%
        {3.25ex \\@plus1ex \\@minus.2ex}%
        {-1em}%
        {\\normalfont\\normalsize\\bfseries}}
      \\renewcommand\\subparagraph{\\@startsection{subparagraph}{6}{\\parindent}%
        {3.25ex \\@plus1ex \\@minus .2ex}%
        {-1em}%
        {\\normalfont\\normalsize\\bfseries}}
      \\def\\toclevel@subsubsubsection{4}
      \\def\\toclevel@paragraph{5}
      \\def\\toclevel@paragraph{6}
      \\def\\l@subsubsubsection{\\@dottedtocline{4}{7em}{1.2em}}
      \\def\\l@paragraph{\\@dottedtocline{5}{10em}{5em}}
      \\def\\l@subparagraph{\\@dottedtocline{6}{14em}{6em}}
      \\makeatother

      \\setcounter{secnumdepth}{4}
      \\setcounter{tocdepth}{4}
      %End Add one more sub section
      
      \\begin{document}
        \\begin{flushleft}
      `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > getMetaData', e).saveError();
    }
  };

  this.getFirstPage = (company, reportType, date) => {
    try {
      let customPage = `
        \\lhead{\\includegraphics[width=2.5cm]{OTAI_Logo.png}}
        \\rhead{}
        \\begin{titlepage}
            \\begin{center}
            
            \\AddToShipoutPictureBG*{\\includegraphics[width=\\paperwidth,height=\\paperheight]{portada_OTAI.png}}
            
            \\vspace*{16cm}
            {\\color[HTML]{FFFFFF} 
                {\\fontsize{30}{48} \\selectfont
                    \\textbf{
                        \\uppercase{
                            Informe de
                        }
                    }
                }
                \\\\*
                {\\fontsize{30}{48} \\selectfont
                    \\textbf{
                        \\uppercase{
                            evaluación
                        }
                    }
                }
                \\\\[1cm]
                {\\Large
                    \\textbf{
                        ${reportType}
                    }
                }
                \\\\[1cm]
                {\\huge
                    \\uppercase{
                        ${company}
                    }
                }
                \\vfill
                ${date}
            }
            \\end{center}
        \\end{titlepage}
      `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > getFirstPage', e).saveError();
    }
  };

  this.getTableOfContents = () => {
    return `
      \\newpage
    
      \\renewcommand{\\contentsname}{
          {\\color[HTML]{377a81}
              \\underline{ÍNDICE} 
          }
      }
      
      \\tableofcontents
      `;
  };

  this.getIntroduction = () => {
    return `
      \\newpage
      \\part{INFORME DE EVALUACIÓN}

      {\\color[HTML]{377a81}
          \\section{INTRODUCCIÓN}
      }
      
      En la actualidad gran cantidad de información circula en los portales web, desde la que se publica con fines promocionales, reglamentos, eventos y agendas, hasta información que permite a las organizaciones descargar responsabilidades de notificación o socialización. Sin embargo esta información no siempre se publica en los formatos recomendados o contemplando todas las necesidades de la población meta. Lo que podría conllevar a denuncias y hasta demandas. \\\\*[0.5cm]
      El derecho a la información es un derecho que tienen todas las personas, independientemente de sus
      necesidades particulares. Estos derechos son garantizados para las personas con discapacidad a través de
      diferentes leyes, entre las que se destacan:
      
      \\begin{enumerate}
          
          \\item Ley 7600 de Igualdad de Oportunidades para las Personas con Discapacidad (PcD) y su reglamento (1996)
          \\item Ley 7948 Ratificación de la Convención Interamericana para la Eliminación de todas las Formas de
          Discriminación contra las PcD (1999)
          \\item Ley 8661 Convención de los Derechos de las PcD y su protocolo facultativo (2008)
          \\item Ley 8662 Inclusión y Protección de las PcD en el Sector Público (2008)
          \\item Directriz Nº 051-MTSS-MICITT Implementación de sitios Web accesibles en el sector público costarricense (04/2019)
      
      \\end{enumerate}
      
      Sin embargo, más allá del cumplimiento de las leyes, el compromiso de lograr una sociedad más inclusiva es el que lleva a generar instrumentos e informes del nivel de accesibilidad de los diversos servicios que brindan organizaciones y empresas. Esta es la razón que sustenta los estudios realizados por el Observatorio de Tecnologías Accesibles e Inclusivas (OTAI).\\\\*[0.5cm]

      Este informe es el resultado del estudio de evaluación de accesibilidad web y fue realizado para conocer el grado de cumplimiento de los principios de accesibilidad, cómo éste va evolucionando a lo largo del tiempo, y los principales problemas que hay que resolver.\\\\*[0.5cm]

      El informe es producido inicialmente por un análisis automático, luego es revisado y complementado en forma manual por personas con discapacidad validando el cumplimiento real de las pautas de accesibilidad. Las evaluaciones se fundamenta en una abstracción de los principios de accesibilidad, basados en las normas WCAG 2.1 y en la norma INTE ISO/IEC 40500:2017. De este modo se consigue una estimación del estado de accesibilidad de las plataformas digitales.
      `;
  };

  this.getMethodology = (idPackage, packageName) => {
    let type;
    let packageText;
    let brands;

    try {
      if (idPackage == 2 || idPackage == 3) {
        type = 'específica';
      } else {
        type = 'aleatoria';
      }

      let customPage = `
      \\newpage
      {\\color[HTML]{377a81}
          \\section{DESCRIPCIÓN DE LA METODOLOGÍA EMPLEADA}
      }
      
      La metodología empleada en el estudio de la evaluación con el paquete de \\textit{${packageName}} se basa en la selección de una muestra ${type} de 32 páginas del portal
      web. En caso que el portal no tenga ese número de páginas, o bien que algunos enlaces estén erróneos, la evaluación incluirá solamente las páginas que fueron identificadas por el sistema. \\\\*[0.5cm]

      Se tomarán como parte de la selección únicamente páginas públicas, aquellas denominadas transaccionales o que requieran algún nivel de autenticación por contraseña o bien por medio de firma digital, no serán contempladas.`;

      switch (idPackage) {
        case 1:
          packageText = `
            \\\\*[0.5cm]
            A través de nuestro sistema de evaluación automática se obtiene un reporte de accesibilidad según grado de cumplimiento de las diferentes secciones del sitio web seleccionadas de forma aleatoria. El sistema revisa el sitio web basado en cada una de las pautas de internacionales de accesibilidad establecidas en la WCAG 2.0 (Web Content Accessibility Guidelines), determinando de esta forma errores, advertencias.
            \\\\*[0.5cm]
            \\textbf{Errores:} Indica que existe un error en el elemento o sección, por lo cual no es accesible.
            \\\\*[0.3cm]
            \\textbf{Advertencias:} Indica que el elemento o sección debe ser revisado, pues su construcción no permite determinar si es accesible o no.
            `;
          break;

        case 2:
          packageText = `
            \\\\*[0.5cm]
            La muestra que se obtenga será evaluada por una plataforma tecnológica de accesibilidad, la cual brinda el grado de cumplimiento, errores y advertencias basado en las pautas internacionales de accesibilidad, establecidas en la WCAG 2.1 (Web Content Accessibility Guidelines), determinando de esta forma errores, advertencias.
            \\\\*[0.5cm]
            \\textbf{Errores:} Indica que existe un error en el elemento o sección, por lo cual no es accesible.
            \\\\*[0.3cm]
            \\textbf{Advertencias:} Indica que el elemento o sección debe ser revisado, pues su construcción no permite determinar si es accesible o no.
            `;
          break;

        case 3:
          packageText = `
            \\\\*[0.5cm]
            Una muestra de secciones específicas del sitio web son revisadas de forma manual por Evaluadores de Accesibilidad, quienes son profesionales con discapacidad que realizarán un análisis a fondo de la muestra seleccionada.
            \\\\*[0.5cm]
            Los Evaluadores determinarán si cada una de las pautas internacionales de accesibilidad establecidas en la WCAG 2.1 (Web Content Accessibility Guidelines) cumplen, no cumplen o no aplican para la sección en revisión. Además de esto, se indica por medio de comentarios consejos o recomendaciones para mejorar la accesibilidad en el sitio.
            \\\\*[0.5cm]
            \\textbf{No Cumple:} Indica que la sección del sitio web NO cumple con la pauta de accesibilidad evaluada.
            `;
          break;

        case 4:
          packageText = `
            \\\\*[0.5cm]
            La muestra que se obtenga será evaluada por una plataforma tecnológica de accesibilidad, la cual brinda el grado de cumplimiento, errores y advertencias basado en las pautas internacionales de accesibilidad, establecidas en la WCAG 2.1 (Web Content Accessibility Guidelines), determinando de esta forma errores, advertencias.
            \\\\*[0.5cm]
            \\textbf{Errores:} Indica que existe un error en el elemento o sección, por lo cual no es accesible.
            \\\\*[0.3cm]
            \\textbf{Advertencias:} Indica que el elemento o sección debe ser revisado, pues su construcción no permite determinar si es accesible o no.
            \\\\*[0.5cm]
            Adicionalmente la muestra previamente seleccionada, es validada de forma manual por Evaluadores de Accesibilidad, quienes son profesionales con discapacidad, quienes determinan si cada una de las pautas de accesibilidad cumple, no cumple o no aplica desde el punto de vista de usuario final y basados en las normas WCAG. Además de esto, se indica por medio de comentarios consejos o recomendaciones como mejorar la accesibilidad en el sitio.    
            \\\\*[0.5cm]
            \\textbf{No Cumple:} Indica que la sección del sitio web NO cumple con la pauta de accesibilidad evaluada.
            `;
          break;
      }

      brands = `
    \\vspace{1cm}
    
    \\begin{center}
        \\begin{tabular}{cc}
                Evaluación realizada por el & Por medio de \\\\
            {
            \\begin{minipage}{.3\\textwidth}
              \\includegraphics[width=0.9\\textwidth]{Logo_TEC.png}
            \\end{minipage}
            } & {
            \\begin{minipage}{.3\\textwidth}
              \\includegraphics[width=0.9\\textwidth]{logo_otai.png}
            \\end{minipage}
            } \\\\
        \\end{tabular}
    \\end{center}
    `;

      return customPage + packageText + brands;
    } catch (e) {
      new CustomErrorLog('customLaTex > getMethodology', e).saveError();
    }
  };

  this.getPagesTable = async pages => {
    try {
      let customPageFirst = `
    \\newpage
    {\\color[HTML]{377a81}
        \\section{MUESTRA DE PÁGINAS}
    }
    \\vspace{0.1cm}
    A continuación, se incluye la muestra de páginas incluidas en esta evaluación:
    \\begin{center}
    \\renewcommand*{\\arraystretch}{1.4}
        \\begin{longtable}{ | p{1.5cm} | p{3.5cm} | p{11.5cm} | }
        \\hline
            { \\color[HTML]{377A81} Página} & {\\color[HTML]{377A81} Título} & {\\color[HTML]{377A81} URL} \\\\
        \\hline
        `;
      let customPagePages;

      let i = 1;
      for (const page of pages) {
        page.title = await replaceSpecialLatexCharacters(page.title);
        page.title = await page.title.replace(/\x5C_/g, ' \x5C_');
        page.url = await replaceSpecialLatexCharacters(page.url);

        if (customPagePages == undefined) {
          customPagePages = `{\\color[HTML]{002D2E} \\textit{${i}}} & {\\color[HTML]{002D2E} ${page.title}} & {\\color[HTML]{002D2E}\\url{${page.url}}} \\\\
            \\hline`;
        } else {
          customPagePages =
            customPagePages +
            `{\\color[HTML]{002D2E} \\textit{${i}}} & {\\color[HTML]{002D2E} ${page.title}} & {\\color[HTML]{002D2E}\\url{${page.url}}} \\\\
            \\hline`;
        }
        i++;
      }

      let customPageFinal = `
        \\end{longtable}
        \\label{tab:List of pages}
    \\end{center}
    `;
      return customPageFirst + customPagePages + customPageFinal;
    } catch (e) {
      new CustomErrorLog('customLaTex > getPagesTable', e).saveError();
    }
  };

  this.getEvaluatedCriterionListSection = () => {
    return `
      \\newpage
      {\\color[HTML]{377a81}
          \\section{CRITERIOS EVALUADOS}
      }
      \\vspace{0.1cm}
        Esta sección contiene la lista de criterios utilizados para evaluar el sitio web.
      \\vspace{0.5cm}
      `;
  };

  this.getEvaluatedCriterionList = async (criterions, isManual = false) => {
    try {
      let title = isManual
        ? 'CRITERIOS DE LOS EVALUADORES MANUALES'
        : 'CRITERIOS DEL EVALUADOR AUTOMATICO';
      let evaluationType = isManual ? 'manual' : 'automática';

      let customPageFirst = `
    {\\color[HTML]{377a81} \\subsection{${title}}}
    \\vspace{0.1cm}
    A continuación, se incluye una tabla que contiene una cabecera: criterio. La columna corresponde al nombre completo de cada criterio incluído en la evaluación ${evaluationType}:
    \\vspace{0.1cm}
    
    \\begin{center}
    \\renewcommand*{\\arraystretch}{1.4}
        \\begin{longtable}{ | p{16.5cm} | }
        \\caption{Criterios para la evaluación ${evaluationType}}\\\\
        \\hline
        {\\color[HTML]{377A81} Crtiterio} \\\\
        \\hline
        `;
      let customTable = '';
      for (const criterion of criterions) {
        customTable =
          customTable +
          `{\\color[HTML]{002D2E} {\\color[HTML]{002D2E} Criterio ${criterion.numberCriterion} - ${criterion.name}} } \\\\
          \\hline`;
      }

      let customPageFinal = `
        \\end{longtable}
        \\label{tab:List of pages}
      \\end{center}
      \\newpage
    `;
      return customPageFirst + customTable + customPageFinal;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getEvaluatedCriterionList',
        e,
      ).saveError();
    }
  };

  this.getGeneralGraphicsResultsIntro = () => {
    return `
      {\\color[HTML]{377a81}
          \\section{RESUMEN DE RESULTADOS}
      }
        Esta sección presenta gráficos y tablas con los resultados de las evaluaciones, mostrando así el estado del sitio en general, por cantidad de hallazgos encontrados por página y por pauta. 
        \\vspace{0.5cm}
      `;
  };

  this.getGeneralSiteAccesibilityStatusForAutomatic = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const generalGraphic = await reportGraphics.retriveStatisticsData(5);

      const accesibilityStatusGraphic = await reportGraphics.generateSVGImageLatexText(
        generalGraphic.exportFileName,
        0.9,
        'Porcentaje de accesibilidad del sitio',
      );
      const accesibilityStatusTable = await reportGraphics.latexTableGenerator(
        'Porcentaje de accesibilidad del sitio',
        generalGraphic.data.xVariableList,
        generalGraphic.data.yVariableList,
        generalGraphic.data.yAxisLabel,
      );

      let pageData = `
      El siguiente gráfico contiene el porcentaje de cumplimiento e incumplimiento de accesibilidad según los criterios de la WCAG2.1 evaluados por la plataforma tecnológica de accesibilidad y la muestra de páginas obtenida. \\

      ${accesibilityStatusGraphic}
      \\begin{center}
      {\\footnotesize
        El gráfico anterior se muestra un gráfico tipo pastel, donde la fracción de color rojo indica el porcentaje de incumplimiento y la verde el porcetaje de cumplimiento. En caso de no presentar colores, indica que no se encontraron barreras de accesibilidad en el sitio.
      }
      \\end{center}

      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de porcentaje de accesibilidad del sitio}}}
      \\end{center}
      \\begin{center}
      {\\footnotesize
        La siguiente tabla contiene dos cabeceras de columnas: Categoría y Porcentaje. La primer columna de la tabla corresponde a las categorías mostradas, en este caso cumplimientos e incumplimientos, y la segunda columna es al porcentaje correspondiente a la categoría de la misma fila. 
      }
      \\end{center}
      ${accesibilityStatusTable}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGeneralSiteAccesibilityStatusForAutomatic',
        e,
      ).saveError();
    }
  };

  this.getGeneralSiteAccesibilityStatusForManual = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const generalGraphic = await reportGraphics.retriveStatisticsData(6);

      const accesibilityStatusGraphic = await reportGraphics.generateSVGImageLatexText(
        generalGraphic.exportFileName,
        0.9,
        'Porcentaje de accesibilidad del sitio',
      );
      const accesibilityStatusTable = await reportGraphics.latexTableGenerator(
        'Porcentaje de accesibilidad del sitio',
        generalGraphic.data.xVariableList,
        generalGraphic.data.yVariableList,
        generalGraphic.data.yAxisLabel,
      );

      let pageData = `
      El siguiente gráfico contiene el porcentaje de cumplimiento e incumplimiento de accesibilidad según los criterios de la WCAG2.1 evaluados por evaluadores profesionales y la muestra de páginas obtenida. \\

      ${accesibilityStatusGraphic}
      \\begin{center}
      {\\footnotesize
        El gráfico anterior se muestra un gráfico tipo pastel, donde la fracción de color rojo indica el porcentaje de incumplimiento y la verde el porcetaje de cumplimiento. En caso de no presentar colores, indica que no se encontraron barreras de accesibilidad en el sitio.
      }
      \\end{center}

      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de porcentaje de accesibilidad del sitio}}}
      \\end{center}
      \\begin{center}
      {\\footnotesize
        La siguiente tabla contiene dos cabeceras de columnas: Categoía y Porcentaje. La primer columna de la tabla corresponde a las categorías mostradas, en este caso cumplimientos e incumplimientos, y la segunda columna es al porcentaje correspondiente a la categoría de la misma fila. 
      }
      \\end{center}
      ${accesibilityStatusTable}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGeneralSiteAccesibilityStatusForManual',
        e,
      ).saveError();
    }
  };

  this.getGeneralGraphicsResultsManual = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const generalGraphicForManualEvaluation = await reportGraphics.retriveStatisticsData(
        4,
      );
      const manualGeneralGraphic = await reportGraphics.generateSVGImageLatexText(
        generalGraphicForManualEvaluation.exportFileName,
        0.9,
        'Cantidad de hallazgos manuales por página',
      );
      const manualGeneralTable = await reportGraphics.latexTableGenerator(
        'Cantidad de hallazgos manuales por página',
        generalGraphicForManualEvaluation.data.xVariableList,
        generalGraphicForManualEvaluation.data.yVariableList,
        generalGraphicForManualEvaluation.data.yAxisLabel,
      );

      let pageData = `
    \\vspace{0.5cm}
      {\\color[HTML]{377a81}
          \\subsection{RESUMEN DE EVALUACIÓN MANUAL}
      }
          El siguiente gráfico sintetiza los hallazgos encontrados por los evaluadores humanos por página. \\
      ${manualGeneralGraphic}
      \\begin{center}
      {\\footnotesize
        El gráfico anterior se muestra cada página evaluada como una barra, el color rojo indica la cantidad de criterios que no cumplen.
      }
      \\end{center}
      \\newpage

      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de cantidad de hallazgos manuales por página}}}
      \\end{center}
      \\begin{center}
      {\\footnotesize
        La siguiente tabla contiene tres cabeceras de columnas: Páginas, No Cumple y URL. La primer columna de la tabla, corresponde al número de página evaluada; la segunda columna es la cantidad de hallazgos encontrados que no cumplen en esa página; y la tercer columna es la dirección 'URL' de la respectiva página.
      }
      \\end{center}
      ${manualGeneralTable}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGeneralSiteAccesibilityStatusForManual',
        e,
      ).saveError();
    }
  };

  this.getGeneralGraphicsResultsAutomatic = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const generalGraphicForAutomaticEvaluation = await reportGraphics.retriveStatisticsData(
        2,
      );
      const automaticGeneralGraphic = await reportGraphics.generateSVGImageLatexText(
        generalGraphicForAutomaticEvaluation.exportFileName,
        0.9,
        'Cantidad de hallazgos automáticos por página',
      );
      const automaticGeneralTable = await reportGraphics.latexTableGenerator(
        'Cantidad de hallazgos automáticos por página',
        generalGraphicForAutomaticEvaluation.data.xVariableList,
        generalGraphicForAutomaticEvaluation.data.yVariableList,
        generalGraphicForAutomaticEvaluation.data.yAxisLabel,
      );

      let pageData = `
    \\vspace{0.5cm}
      {\\color[HTML]{377a81}
          \\subsection{RESUMEN DE EVALUACIÓN AUTOMÁTICA}
      }
      El siguiente gráfico corresponde a los hallazgos encontrados por 
      la evaluación automática organizados por página.
      ${automaticGeneralGraphic}
      \\begin{center}
      {\\footnotesize
      El gráfico anterior se muestra cada página evaluada en la evaluación automática como una barra, el color rojo indica la cantidad de criterios que no cumplen.
      }
      \\end{center}
      \\newpage
      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de cantidad de hallazgos automáticos por página}}}
      \\end{center}
      \\begin{center}
        {\\footnotesize
        La siguiente tabla contiene tres cabeceras de columnas: Páginas, No Cumple y URL. La primer columna de la tabla, corresponde al número de página evaluada; la segunda columna es la cantidad de hallazgos encontrados que no cumplen criterios en esa página; y la tercer columna es la dirección 'URL' de la página correspondiente'.
        }
      \\end{center}
      ${automaticGeneralTable}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGeneralGraphicsResultsAutomatic',
        e,
      ).saveError();
    }
  };

  this.getGraphicsResultsAutomaticSection = async () => {
    return `
    {\\color[HTML]{377a81}
      \\subsection{RESULTADOS DE EVALUACIÓN AUTOMÁTICA}
    }`;
  };

  this.getGraphicsResultsAutomatic = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const graphicForAutomaticEvaluation = await reportGraphics.retriveStatisticsData(
        1,
      );
      const automaticGraphicByGuideline = await reportGraphics.generateSVGImageLatexText(
        graphicForAutomaticEvaluation.exportFileName,
        0.9,
        'Cantidad de hallazgos automáticos por pauta',
      );
      const automaticTableByGuideline = await reportGraphics.latexTableGenerator(
        'Cantidad de hallazgos automáticos por pauta',
        graphicForAutomaticEvaluation.data.xVariableList,
        graphicForAutomaticEvaluation.data.yVariableList,
        graphicForAutomaticEvaluation.data.yAxisLabel,
      );
      let pageData = `
      El siguiente gráfico corresponde a los hallazgos encontrados por 
      la evaluación automática organizados por pauta.

      ${automaticGraphicByGuideline}
      \\begin{center}
      {\\footnotesize
        El gráfico anterior se muestra diferentes grupos de barras, cada grupo pertenece a una pauta evaluada en la evaluación automática. Cada barra de color rojo indica la cantidad de criterios que no cumplen para dicha pauta.
      }
      \\end{center}
      \\newpage
      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de cantidad de hallazgos automáticos por pauta}}}
      \\end{center}
      \\begin{center}
        {\\footnotesize
        La siguiente tabla contiene dos cabeceras de columnas: Pautas, No Cumple. La primer columna de la tabla, corresponde a la pauta a la que pertenecen los hallazgos encontrados; y la segunda columna es la cantidad de hallazgos encontrados que no cumplen criterios en esa página.
        }
      \\end{center}
      ${automaticTableByGuideline}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGeneralGraphicsResultsAutomatic',
        e,
      ).saveError();
    }
  };

  this.getGraphicsResultsManualSection = async () => {
    return `
    {\\color[HTML]{377a81}
        \\subsection{RESULTADOS DE EVALUACIÓN MANUAL}
    }`;
  };

  this.getGraphicsResultsManual = async idEvaluation => {
    try {
      const reportGraphics = await new ReportGraphics(idEvaluation);
      const graphicForManualEvaluation = await reportGraphics.retriveStatisticsData(
        3,
      );
      const manualGraphicByGuideline = await reportGraphics.generateSVGImageLatexText(
        graphicForManualEvaluation.exportFileName,
        0.9,
        'Cantidad de hallazgos manuales por pauta',
      );
      const manualTableByGuideline = await reportGraphics.latexTableGenerator(
        'Cantidad de hallazgos manuales por pauta',
        graphicForManualEvaluation.data.xVariableList,
        graphicForManualEvaluation.data.yVariableList,
        graphicForManualEvaluation.data.yAxisLabel,
      );
      let pageData = `
      El siguiente gráfico corresponde a los hallazgos encontrados por 
      los evaluadores humanos organizados por pauta.

      ${manualGraphicByGuideline}
      \\begin{center}
      {\\footnotesize
        El gráfico anterior se muestra diferentes grupos de barras, cada grupo pertenece a un pauta evaluada en la evaluación manual. Cada grupo de barras contiene una barra de color roja que indica la cantidad de criterios que no cumplen para la pauta correspondiente.
      }
      \\end{center}
      \\newpage
      \\begin{center}
      {\\large\\textbf{{\\color[HTML]{377A81}Tabla de cantidad de hallazgos manuales por pauta}}}
      \\end{center}
      \\begin{center}
        {\\footnotesize
        La siguiente tabla contiene dos cabeceras de columnas: Pauta, No Cumple. La primer columna de la tabla, corresponde a la pauta a la que pertenecen los hallazgos encontrados; la segunda columna es la cantidad de criterios encontrados que no cumplen para esa pauta.
        }
      \\end{center}
      ${manualTableByGuideline}
      \\newpage
    `;

      return pageData;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGraphicsResultsManual',
        e,
      ).saveError();
    }
  };

  this.noticesSection = async noticesList => {
    try {
      let customPage = `
      \\newpage
      {\\color[HTML]{377a81}
          \\section{CONSIDERACIONES A TOMAR EN CUENTA}
      }
      \\vspace{0.1cm}
      A continuación se listan una serie de consideraciones que se deben tener en cuenta a la hora de revisar el sitio web, son errores que comúnmente se podrían cometer en la construcción de páginas web:
      
      \\vspace{0.5cm}
      
      \\begin{itemize}
    `;

      let customItems = ``;
      for (let n = 0; n < noticesList.length; n++) {
        let noticeDescription = noticesList[n].description;
        noticeDescription = await noticeDescription.replace(/%/g, '\x5C\x5C%');
        customItems =
          customItems +
          `
            \\item ${noticeDescription}
        `;
      }

      const customPageFinal = `
      \\end{itemize}
      `;

      return customPage + customItems + customPageFinal;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getGraphicsResultsManual',
        e,
      ).saveError();
    }
  };

  this.automaticEvaluationSection = async () => {
    try {
      const sectionTitle = 'Evaluación Automática';
      const automaticEvaluationSectionText = `Nuestro sistema de evaluación automática revisa cada página web seleccionada manual o automaticamente, indicando únicamente errores y advertencias (errores potenciales). Los resultados mostrados en esta sección (Evaluación Automática) se agrupan por criterios y tipos de hallazgos, según cumplimientos de las pautas internacionales de accesibilidad establecidas en la WCAG 2.0 (Web Content Accessibility Guidelines).`;
      const customPage = `
      \\newpage
      {\\color[HTML]{377a81}
          \\section{${sectionTitle}}
      }
      ${automaticEvaluationSectionText}
      \\vspace{0.5cm}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > automaticEvaluationSection',
        e,
      ).saveError();
    }
  };

  this.getCriterionSection = async (criterion, aFindingsQuantity) => {
    try {
      criterion.referenceLink = await replaceSpecialLatexCharacters(
        criterion.referenceLink,
      );

      const moreInfoText =
        'Para más información acerca de éste criterio, puede visitar el siguiente enlace en';
      const criterionString = 'CRITERIO';
      const findingString = 'hallazgos';
      const quantityString = 'Cantidad';
      let customPage = `
    {\\color[HTML]{377a81}
      \\subsection{
        \\uppercase{${criterionString} ${criterion.numberCriterion} - ${criterion.name}}
      }
    }
    ${moreInfoText}: \\\\
    \\url{${criterion.referenceLink}} \\\\[0.3cm]
    ${quantityString} ${findingString}: ${aFindingsQuantity} ${findingString} \\\\[0.5cm]
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > getCriterionSection', e).saveError();
    }
  };

  this.getBeginFindingsSection = async (findingType, description) => {
    try {
      description = await replaceSpecialLatexCharacters(description);
      const findingColor = await getFindingTypeColor(findingType);
      let customPage = `
    \\textbf{Descripción del hallazgo \\hspace{10cm} Tipo: \\tikzcircle[${findingColor}, fill=${findingColor}]{6pt} \\ ${findingType}
    }\\\\
    \\vspace{0.3cm}
    ${description}
    \\begin{center}
      \\renewcommand*{\\arraystretch}{1.4}
        \\begin{longtable}{ | l | p{10cm}!{\\color{ColorLightgray}\\vrule}p{7.2cm} | p{6cm} | }
        \\hline`;
      return customPage;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getBeginFindingsSection',
        e,
      ).saveError();
    }
  };

  this.getURLFindingsTableSeparator = async (title, url) => {
    try {
      title = await replaceSpecialLatexCharacters(title);
      url = await replaceSpecialLatexCharacters(url);
      const adjustTitle = title.length > 115 ? 'p{18cm}' : 'c';
      const adjustUrl = url.length > 115 ? 'p{18cm}' : 'c';

      let customPage = `
      \\multicolumn{3}{| ${adjustTitle} |}
      {
        \\textbf{${title}}
      }\\\\
      \\multicolumn{3}{| ${adjustUrl} |}
      {
        \\url{${url}}
      }\\\\
      \\hline
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > getURLFindingsTableSeparator',
        e,
      ).saveError();
    }
  };

  this.getFindingsTable = async (index, htmlCode, htmlPath) => {
    try {
      htmlPath = await replaceSpecialLatexCharacters(htmlPath);
      htmlCode = await htmlCode.replace(/%/g, '\\%');
      let customColor = index % 2 === 0 ? 'white' : 'ColorLightgray';
      const htmlCodeHeader = `Código HTML`;
      const htmlPathHeader = `HTML PATH`;
      let customPage = `
    \\cellcolor{${customColor}} {${index}} & { \\color[HTML]{377A81} \\textbf{${htmlCodeHeader}}} & { \\color[HTML]{377A81} \\textbf{${htmlPathHeader}}} \\\\
    \\cellcolor{${customColor}} & {
    \\vspace{-0.6cm}
    \\begin{minted}[breaklines, breakanywhere]{html}
  ${htmlCode}
    \\end{minted}
    } & { ${htmlPath} }\\\\
    \\hline
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > getFindingsTable', e).saveError();
    }
  };

  this.getEndFindingsSection = () => {
    return `
      \\end{longtable}
    \\end{center}
    `;
  };

  this.manualEvaluationSection = () => {
    return `
      \\newpage
      {\\color[HTML]{377a81}
          \\section{Evaluación Manual}
      }
      Una muestra de secciones específicas del sitio web son revisadas de forma manual por Evaluadores de Accesibilidad, quienes son profesionales con discapacidad que realizarán un análisis a fondo de la muestra seleccionada. Los resultados mostrados en esta sección (Evaluación Automática) se agrupan por páginas, en cada página se agrupan en usuarios evaluadores, y luego los hallazgos de cada usuario bajo la especificaión o especificaciones correspondientes. Los criterios evaluados van según cumplimientos de las pautas internacionales de accesibilidad establecidas en la WCAG 2.0 (Web Content Accessibility Guidelines).
      \\vspace{0.5cm}
    `;
  };

  this.userDisabilityRoleSection = disabilityName => {
    let customPage = `
      {\\color[HTML]{377a81}
          \\subsection{
            Usuario: ${disabilityName}.
          }
      }
    `;
    return customPage;
  };

  this.specSubSection = spect => {
    try {
      let customPage = `
      {\\color[HTML]{377a81}
        \\subsubsection{
          Especificación ${spect.index}
        }
      }
      \\textbf{Dispositivo:} ${spect.device}\\\\*[1mm]
      \\textbf{Sistema Operativo:} ${spect.operativeSystem}\\\\*[1mm]
      \\textbf{Navegador:} ${spect.browser}\\\\*[1mm]
      \\textbf{Producto de Apoyo:} ${spect.supportTool}\\\\*[1mm]
      
      \\vspace{0.5cm} 
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > specSubSection', e).saveError();
    }
  };

  this.pageSection = async (i, title = '', url = '') => {
    try {
      url = await replaceSpecialLatexCharacters(url);
      title = await replaceSpecialLatexCharacters(title);
      let customPage = `
      {\\color[HTML]{377a81}
        \\subsubsubsection{Página ${i} - ${title}}
      }
      \\textbf{URL: }${url}
      \\vspace{0.5cm}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > pageSection', e).saveError();
    }
  };

  this.userObservation = async (userExperience = '') => {
    try {
      userExperience = await replaceSpecialLatexCharacters(userExperience);
      let customPage = `
      {\\color[HTML]{377a81}
          Experiencia de usuario evaluador correspondiente para este principio.
      }\\\\*[1mm]
      ${userExperience}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > userObservation', e).saveError();
    }
  };

  this.principleSection = async (principleName, principleLink) => {
    try {
      principleName = await replaceSpecialLatexCharacters(principleName);
      principleLink = await replaceSpecialLatexCharacters(principleLink);
      let customPage = `
      {\\color[HTML]{377a81}
        \\uppercase{
            \\textbf{PRINCIPIO ${principleName}}
        }
      }\\\\
      Para más información acerca del principio, puede visitar el siguiente enlace en: \\\\
      \\url{${principleLink}}
      
      \\vspace{0.5cm}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > principleSection', e).saveError();
    }
  };

  this.criterionSection = async (criterionNumber, name, referenceLink) => {
    try {
      referenceLink = await replaceSpecialLatexCharacters(referenceLink);
      let criterionLabel = 'Criterio';
      let customPage = `
      \\vspace{0.3cm}
      {\\color[HTML]{377a81}
        \\textbf{${criterionLabel} ${criterionNumber} - ${name}}
      }\\\\
      Para más información acerca de éste criterio, puede visitar el siguiente enlace en: \\\\
      \\url{${referenceLink}}
      \\vspace{0.3cm}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > criterionSection', e).saveError();
    }
  };

  this.recommendations = async (answers, ansMapIdXRecommendation) => {
    try {
      let customPage = `
    \\begin{itemize}
    `;
      let recommendation = '';
      for (const answer of answers) {
        recommendation = ansMapIdXRecommendation[answer.recommendationsId];
        if (recommendation) {
          recommendation = await replaceSpecialLatexCharacters(
            recommendation.descriptionRecommendation,
          );
          customPage =
            customPage +
            `\\item ${recommendation}
          `;
        }
      }
      customPage =
        customPage +
        `\\end{itemize}
      `;

      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > recommendations', e).saveError();
    }
  };

  function getFindingTypeColor(findingType) {
    findingType = findingType.toLocaleLowerCase();
    let colorCircleType = 'red';
    if (findingType == 'warning' || findingType == 'advertencia') {
      colorCircleType = 'ColorPurple';
    }
    return colorCircleType;
  }

  this.getEndDocument = async (mainURL, code) => {
    try {
      let urlEAWLogin = 'http://13.58.240.19:5280/\\#/login';
      mainURL = await replaceSpecialLatexCharacters(mainURL);
      let customPage = `
    \\newpage

    \\invisiblesection{Conocer mis resultados en línea}
        
    \\begin{center}
        
        \\AddToShipoutPictureBG*{\\includegraphics[width=\\paperwidth,height=\\paperheight]{Information.png}}
        
        \\vspace*{12.2cm}
        {\\color[HTML]{FFFFFF} 
            \\hspace{1cm}
            {\\fontsize{15}{48} \\selectfont
                \\textbf{
                    \\underline{
                        \\url{${urlEAWLogin}}
                    }
                }
            }
        }
        \\\\[2.4cm]
        {\\color[HTML]{377A81}
            \\hspace{2cm}
            {\\fontsize{14}{48} \\selectfont
                ${mainURL}
            }
        }
        \\\\[0.7cm]
        {\\color[HTML]{377A81}
            \\hspace{2cm}
            {\\fontsize{14}{48} \\selectfont
                ${code}
            }
        }
        \\end{center}


      \\end{flushleft}
    \\end{document}
    `;
      return customPage;
    } catch (e) {
      new CustomErrorLog('customLaTex > getEndDocument', e).saveError();
    }
  };

  /**
   * Replace special latex chars that has
   * functions and are not characters.
   * @param {String} text
   */
  async function replaceSpecialLatexCharacters(text) {
    try {
      let result = text;
      const doubleBackSlash = '\x5C\x5C';
      result = await result.replace(/\x5C/g, doubleBackSlash);
      result = await result.replace(/_/g, '\x5C_');
      result = await result.replace(/&/g, '\x5C&');
      result = await result.replace(/#/g, '\x5C#');
      result = await result.replace(/%/g, '\x5C%');
      result = await result.replace(/{/g, '\x5C{');
      result = await result.replace(/}/g, '\x5C}');
      result = await result.replace(/~/g, '\x5C~');
      result = await result.replace(/\$/g, '\x5C$');
      return result;
    } catch (e) {
      new CustomErrorLog(
        'customLaTex > replaceSpecialLatexCharacters',
        e,
      ).saveError();
    }
  }
};
