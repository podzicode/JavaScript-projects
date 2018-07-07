var budgetController=(function(){
	var Expenses= function(ids,description,vals){
		this.ids=ids;
		this.description=description;
		this.values=vals;
	};
	var Income=function(ids,description,vals){
		this.ids=ids;
		this.description=description;
		this.values=vals;
	};
	var data={
		allItems:{
			income:[],
			expense:[]
		},
		totals:{
			expense:0,
			income:0
		},
		budget:0,
		percentage:-1

	};
	var totalCalculations= function(type){
		var sum=0;
		data.allItems[type].forEach(function(curr){
			sum+=curr.values;

		});
		data.totals[type]=sum;

	};
	return{
		addItem:function(type,des,val){
			var newItem,ID;
			//generate ID
			if(data.allItems[type]>0){
				ID=data.allItems[type][data.allItems[type].length -1].ids+1;
			}
			else{
				ID=0;
			}
			//Create new item based on type
			if(type==='expense'){
				newItem=new Expenses(ID,des,val);
			}
			else if(type==='income'){
				newItem= new Income(ID,des,val);
			}
			//Push the item into the all items
			data.allItems[type].push(newItem);
			return newItem;

		},
		returnBudget:function(){
			return{
				budget:data.budget,
				totalInc:data.totals.income,
				totalExp:data.totals.expense,
				percentage:data.percentage
			};
		},
		calculateBudget:function(){
			//calculate Total income and expenses
			totalCalculations('income');
			totalCalculations('expense');

			//calculate the budget (Income -Expenses)
			data.budget= data.totals.income-data.totals.expense;

			//calculate the percentage of income spent
			data.percentage=Math.round((data.totals.expense/data.totals.income)*100);



		},
		testing:function(){
			console.log(data);
		}
	}
})();

var UIcontroller=(function(){
	var DomUI={
		typeSelector:'.add__type',
		description:'.add__description',
		valueSelector:'.add__value',
		buttonSelector:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list'	

	};
	return {
		getInput: function(){
			return{
			 types: document.querySelector(DomUI.typeSelector).value, // We get income / expense
			 description: document.querySelector(DomUI.description).value,
			 val: parseFloat(document.querySelector(DomUI.valueSelector).value)
			};
			
		},
		getDomStrings:function(){
			return DomUI;
		},
		addListItem:function(obj,type){
			var html,newHtml,element;
			//Create HTML string with placeHolders
			if(type==='income'){
				element=DomUI.incomeContainer;
				html='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">  <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

			}
			else if(type==='expense'){
				element=DomUI.expenseContainer;
				html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
			}
			
			//Replace the placeHolders with Content
			newHtml=html.replace('%id%',obj.ids);
			newHtml=newHtml.replace('%value%',obj.values);
			newHtml=newHtml.replace('%description%',obj.description);


			//Insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);



		},

		clearFields: function(){
			var fields,feildsArr
			fields=document.querySelectorAll(DomUI.description+','+DomUI.valueSelector);
			fieldsArr=Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current,index,array){
				current.value="";
				fieldsArr[0].focus();
			});

		}

	};

})();


var controller=(function(bdgtCont,UIcont){
	var setUpEventListeners=function(){
		var Dom=UIcont.getDomStrings();
		document.querySelector(Dom.buttonSelector).addEventListener('click',ctrlAdditem);
		document.addEventListener('keypress',function(event){
		if(event.keyCode===13 || event.which===13){
			ctrlAdditem();
		}
	})
	};
	var updateBudget= function(){
		// Calculate Budget
		bdgtCont.calculateBudget();

		// Return Budget
		var budget=bdgtCont.returnBudget();

		// Display the Budget on UI

	};
	var ctrlAdditem =function(){

		//Get User Input
		var input= UIcont.getInput();
		//Add New Item
		if(input.description!="" && !isNaN(input.val) && input.val>0){
		var newItem= bdgtCont.addItem(input.types,input.description,input.val);
		//Add Item To UI
		UIcont.addListItem(newItem,input.types);	
		// Clear the contents
		UIcont.clearFields();	
		//Calculate and Update budget
		updateBudget();
		}
		
	};
	return{
		init: function(){
			setUpEventListeners();
		}
	}
})(budgetController,UIcontroller);

controller.init();