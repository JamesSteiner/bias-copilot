function handleFileSelect() {
  let file = document.getElementById("csvFile").files[0];
  if (!file) {
    console.log("No file selected");
    return;
  }
  let summaryPromptField = document.getElementById("summaryPromptField");
  let biasPromptField = document.getElementById("biasPromptField");

  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    let csv = event.target.result;
    const evalData = d3.csvParse(csv);
    console.log(evalData);

    let output = document.getElementById("output");
    output.innerHTML = "";

    let table = document.createElement("table");
    setUpTable(table);
    setUpRowsOfTable(table, evalData);
    output.appendChild(table);

    getResultsFromAPI(summaryPromptField, biasPromptField, evalData, table);
  };

  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

async function getResultsFromAPI(
  summaryPromptField,
  biasPromptField,
  evalData,
  table
) {
  for (let i = 0; i < evalData.length; i++) {
    // get prompts from textares
    let summary_prompt = summaryPromptField.value + evalData[i].CODE;
    let bias_prompt =
      biasPromptField.value + evalData[i].CODE + "\nYour Answer:";

    // calling API
    // TODO: keep calling until getting a response
    let bias_response = await OpenAI_response(bias_prompt, {
      max_tokens: 500,
    });
    let summary_response = await OpenAI_response(summary_prompt, {
      max_tokens: 500,
    });
    // console.log(openai_bias_response);
    updateRowWithResults(evalData, i, bias_response, summary_response, table);
    await timer(3000); // then the created Promise can be awaited
  }
}

function setUpTable(table) {
  let tr = document.createElement("tr");
  let hd0 = document.createElement("td");
  hd0.innerText = "ID";
  tr.appendChild(hd0);
  let hd1 = document.createElement("td");
  hd1.innerText = "CODE";
  tr.appendChild(hd1);
  let hd2 = document.createElement("td");
  hd2.innerText = "ACTUAL_BIAS";
  tr.appendChild(hd2);
  let hd3 = document.createElement("td");
  hd3.innerText = "SUMMARY";
  tr.appendChild(hd3);
  let hd4 = document.createElement("td");
  hd4.innerText = "PRED_BIAS";
  tr.appendChild(hd4);
  table.appendChild(tr);
}

function setUpRowsOfTable(table, evalData) {
  for (let i = 0; i < evalData.length; i++) {
    let tr = document.createElement("tr");
    let id_td = document.createElement("td");
    id_td.innerText = evalData[i].ID;
    tr.appendChild(id_td);
    let code_td = document.createElement("td");
    code_td.innerText = evalData[i].CODE;
    tr.appendChild(code_td);
    let bias_td = document.createElement("td");
    bias_td.innerText = evalData[i].BIAS;
    tr.appendChild(bias_td);
    let summary_td = document.createElement("td");
    summary_td.innerText = "";
    tr.appendChild(summary_td);
    let pred_bias_td = document.createElement("td");
    pred_bias_td.innerText = "";
    tr.appendChild(pred_bias_td);
    table.appendChild(tr);
  }
}

function updateRowWithResults(evalData, i, predBias, summary, table) {
  row = table.rows[i + 1];
  row.cells[4].innerText = predBias;
  row.cells[3].innerText = summary;
}

function addRowToTableWithResults(evalData, i, pred_bias, summary, table) {
  let output = document.getElementById("output");
  let tr = document.createElement("tr");
  let id_td = document.createElement("td");
  id_td.innerText = evalData[i].ID;
  tr.appendChild(id_td);
  let code_td = document.createElement("td");
  code_td.innerText = evalData[i].CODE;
  tr.appendChild(code_td);
  let bias_td = document.createElement("td");
  bias_td.innerText = evalData[i].BIAS;
  tr.appendChild(bias_td);
  let summary_td = document.createElement("td");
  summary_td.innerText = summary;
  tr.appendChild(summary_td);
  let pred_bias_td = document.createElement("td");
  pred_bias_td.innerText = pred_bias;
  tr.appendChild(pred_bias_td);
  table.appendChild(tr);
  output.appendChild(table);
}
