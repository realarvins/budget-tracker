const form = document.querySelector('.add');
const incomeList = document.querySelector('ul.income-list');
const expenseList = document.querySelector('ul.expense-list');

const balace = document.getElementById("balance");
const income = document.getElementById("income");
const  expense = document.getElementById("expense");



//to fixed  the error when we refresh the page if use to ternary operator to fixed the data in localStorage.
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];



  function listGenerateTemplate(id , source , amount , time){
                return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                
                &#x20b9;<span>${Math.abs(amount)}</span>       
                <i class="bi bi-trash delete"></i>
            </li>`;  
        }

function addTransactionDom(id,source,amount,time){
  //create li element
  if(amount > 0){
    incomeList.innerHTML +=  listGenerateTemplate(id,source,amount,time);
  }
  
  else {
    expenseList.innerHTML += listGenerateTemplate(id,source,amount,time);
  }
}

function addTransaction(source, amount) {

  const time = new Date();
  const transaction = {
      id : Math.floor(Math.random() * 1000),  //generate random number for each item to remove float number.
      source : source,
      amount : amount,
      //to fetch the time in localeStorage  format.
      time : `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
  };
  transactions.push(transaction);
  localStorage.setItem("transactions",JSON.stringify(transactions));
  addTransactionDom(transaction.id, source, amount, transaction.time);
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTransaction(form.source.value, Number(form.amount.value));
  form.reset();
  updateStatistics();
  
})  


//Start transaction history

function getTransaction(){
  transactions.forEach(transactions => {
    if(transactions.amount > 0){
      incomeList.innerHTML += listGenerateTemplate(transactions.id , transactions.source, transactions.amount , transactions.time);
    }else{
      expenseList.innerHTML += listGenerateTemplate(transactions.id , transactions.source, transactions.amount , transactions.time);
    }
  });
}
getTransaction();


//delete transaction history and expense
function deleteTransaction(id){
  transactions = transactions.filter(transaction => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", e => {
  if(e.target.classList.contains("delete")){
    e.target.parentElement.remove();
    deleteTransaction(Number(e.target.parentElement.dataset.id));

    updateStatistics();
  }
});

expenseList.addEventListener("click", e => {
  if(e.target.classList.contains("delete")){
    e.target.parentElement.remove();
    deleteTransaction(Number(e.target.parentElement.dataset.id));
    
    updateStatistics();
  }
});


// update the balace , income , and expense to Statistics value;

function updateStatistics(){
    const updateIncome = transactions
                              .filter(transaction => transaction.amount > 0)
                              .reduce((total, transaction) => total += transaction.amount, 0);
                              
                              
    const updateExpense = transactions
                              .filter(transaction => transaction.amount < 0)
                              .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);

    updateBalance = updateIncome - updateExpense;
    balance.textContent = updateBalance;
    income.textContent = updateIncome;
    expense.textContent = updateExpense;
}
updateStatistics();

// function pagePrint(transactionHistory){
//   const printData = document.getElementById("transactionHistory");
//   newWin = window.open("");
//   newWin.document.write(printData.outerHTML);
//   newWin.print();
//   newWin.close();
// }

function printContent() {
  window.print()
}