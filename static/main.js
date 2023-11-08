
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}


function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}


function isDigit(str) {
    return /^\d{1}$/.test(str);
}


function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}


function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && (priority(stack[stack.length - 1])) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(expression) {
    const stack = [];
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    };

    const tokens = expression.split(" ");

    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (token in operators) {
            const [b, a] = [stack.pop(), stack.pop()];
            stack.push(operators[token](a, b));
        }
    }

    return stack[0];
}
function clickHandler(event) {
    const screen = document.querySelector('.screen span');

    if (event.target.classList.contains('digit') || event.target.classList.contains('operation') || event.target.classList.contains('bracket')) {
        screen.textContent += event.target.textContent;
    } else if (event.target.classList.contains('clear')) {
        screen.textContent = '';
    } else if (event.target.classList.contains('result')) {
        const expression = screen.textContent.trim();
        const reversePolish = compile(expression);
        const result = evaluate(reversePolish);
        screen.textContent = result;
    }
}


window.onload = function () {
    const calculator = document.querySelector('.calc-container');
    calculator.addEventListener('click', clickHandler);
};

