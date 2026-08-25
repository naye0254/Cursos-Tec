'use strict';

const EAWConstants = require('../eaw-constants');

/**
 * Function to return an email structure.
 * @param {string} name
 * @param {string} company
 * @param {string} telephone
 * @param {string} email
 * @param {string} message
 * @param {string} iana
 * */
module.exports = function DirectConsultantEvaluationRequest(
  name = '',
  telephone = '',
  email = '',
  message = '',
  textData,
) {
  const eawConstants = new EAWConstants();
  const date = new Date();
  const imageName = 'UserRegisterEmail.png';

  this.getHtml = async () => {
    const crFormatDate = await getFormatedDate(date);
    const minuteSeconds = await getFormatedMinutes(date);
    const customHtml =
      `
    <!DOCTYPE html>
    <html lang="${textData.lang}">
      <head>
        <title>¡Confirmación de registro!</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style>
          @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
          .card {
            min-width: 200px;
            transition: 0.3s;
            font-size: 20px !important;
            margin-bottom: 40px;
            background-color: #ffffff; 
            height: 50%; border-radius: 5%;
          }
          .shadow {
            border-bottom: 5px solid #00000029;
            border-right: 1px solid #00000029;
            border-left: 1px solid #00000029;
          }
          .text-container {
            padding: 10px 60px 20px 60px;
            text-align: center;
          }
          body {
            max-width: 600px;
            max-height: 400px;
            height: auto;
            width: 100% !important;
            color: #0e2431;
            font-family: 'Lato', sans-serif;
            font-size: 18px !important;
            padding: 0;
            margin-top: 5%;
          }
          .card-container {
            margin: auto;
            width: 60%;
          }
          @media (max-width:500px) {
            body {
              width: 100% !important;
            }
            .text-container {
              padding: 10px 10px 20px 10px !important;
            }
          }
        </style>
      </head>
      <body style= "margin: auto !important;
        max-width: 600px !important;"
      >
        <div class="card-container">
          <div
          class="card shadow">` +
      `<img src="${eawConstants.EnvVars.API_ENDPOINT}/containers/img/download/${imageName}" alt="${textData.administrator.evaluationRequest.imageAlt}" style="width:100%" />` +
      `        <div class="text-container">` +
      `          <h1 style="font-size: 20px !important; font-weight: normal !important; color: #0E2431;"> <b>${name}</b> ${textData.administrator.evaluationRequest.contact}` +
      `          </h1>` +
      `        </div>` +
      `      </div>` +
      `    </div>` +
      `    <div style="margin: 40px 60px 30px 60px;">` +
      `      <p style = "font-size: 18px !important;"> ${name} ${textData.administrator.evaluationRequest.bodyInfo1} ${crFormatDate} ${textData.administrator.evaluationRequest.bodyInfo2} ${minuteSeconds} ${textData.administrator.evaluationRequest.bodyInfo3}: </p>` +
      `      <h2 style="font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.evaluationRequest.lables.name}:</b> ${name} </h2>` +
      `      <h2 style="font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.evaluationRequest.lables.phone}:</b> ${telephone} </h2>` +
      `      <h2 style="font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.evaluationRequest.lables.mail}:</b> ${email} </h2>` +
      `      <h2 style="font-size: 18px !important; font-weight: normal !important;"> <b>${textData.administrator.evaluationRequest.lables.message}:</b> ${message} </h2>` +
      `    </div>` +
      `  </body>` +
      `</html>`;

    return customHtml;
  };

  /**
   * Returns a date with the format dd/mm/yyyy
   * @param {date} date
   */
  async function getFormatedDate(date) {
    return (
      (await date.getDate()) +
      '/' +
      ((await date.getMonth()) + 1) +
      '/' +
      (await date.getFullYear())
    );
  }

  /**
   * Returns the minutes and seconds of the date.
   * @param {date} date
   */
  async function getFormatedMinutes(date) {
    return (await date.getHours()) + ':' + (await date.getMinutes());
  }
};
