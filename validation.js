class validationClass {
    form = null;
    config = {};
    rules = [];
    defaultMessages = {
      required  : () => {
          return 'can not be empty'
      },
        minLength : (length) => {
          return "must have at least " + length+" characters"
        },
        maxLength : (length) => {
            return "Must be no more than " + length  + " characters"
        }
    };
    errors = [];
    constructor(formId , config){
        this.form = document.getElementById(formId);
        this.config = config;
        this.getRules();
        this.setSubmit();
    }

    setSubmit(){
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
             for(const rule in this.rules){
                let el =this.rules[rule]['elementRule'];
                for(let vl in this.rules[rule]['statements']){
                    let state = this.rules[rule]['statements'][vl];
                    let conditionName = Object.keys(this.rules[rule]['statements'][vl])[0];
                    this[conditionName].call(this ,el ,  state);
                }
            }
             if (!this.errors.length){
                this.config.submit(this.form);
             }
        });
    }

    getRules(){
        for(const rule in this.config.rules){
            let item = {};
            item.elementRule = document.getElementsByName(rule)[0];
            item.statements = [];
            for (const validate in this.config.rules[rule]){
                item.statements.push({
                   [validate] :this.config.rules[rule][validate],
                   message : this.getMessage(rule , validate , this.config.rules[rule][validate])
                });
            }
            this.rules.push(item);
        }
        this.setEvent();
    }
    getMessage(inputName , validateName , value){
       return this.config.messages[inputName][validateName] != undefined ? this.config.messages[inputName][validateName] : this.defaultMessages[validateName](value);
    }
    setEvent(){
        for(const rule in this.rules){
            let el =this.rules[rule]['elementRule'];
            for(let vl in this.rules[rule]['statements']){
                let state = this.rules[rule]['statements'][vl];
                let conditionName = Object.keys(this.rules[rule]['statements'][vl])[0];
                el.addEventListener('blur',this[conditionName].bind(this ,el ,  state));
            }
        }
    }

    // conditions
    required(element , condition){
        if(element.value.length){
            this.removeError(element);
        }else{
            this.addError(element , condition.message);
        }
    }


    minLength(element , condition){
        if(element.value.length <= condition.minLength){
            this.addError(element , condition.message);
        }else{
            this.removeError(element);
        }
    }

    maxLength(element , condition){
        if(element.value.length > condition.maxLength ){
            this.removeError(element);
        }else{
            this.addError(element , condition.message);
        }
    }

    email(element , condition){
        var regx = /^[a-zA-Z][a-zA-Z0-9_-]*@[a-zA-Z]*\.[a-zA-Z]{2,4}$/;
        if(!regx.test(element.value)){
            this.addError(element , condition.message);
        }else{
            this.removeError(element);
        }
    }

    // error handling
    removeError(element){
        if(element.nextElementSibling.nodeName == "SPAN") {
            element.nextElementSibling.remove();
            this.errors.pop();
        }
    }

    addError(element , message){
        if (element.nextElementSibling.nodeName != "SPAN") {
            const spanTag = document.createElement('span');
            spanTag.innerText = message;
            element.parentNode.insertBefore(spanTag, element.nextSibling);
            this.errors.push("error");
        }
    }

}

function validation(formId , config) {
    new validationClass(formId,config);
}