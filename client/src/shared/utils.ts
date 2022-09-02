import chalk from "chalk";

export const isDigit = (num: number) => {
    return num >= 0 && num <= 9;
}

export const randRange = (min: number, max: number) => {
    return min + Math.random() * (max - min);
}

export const errMsg = (message: string) => {
    console.log(chalk.redBright(chalk.bold("ERROR: ")) + message);
}

export const isNumber = (value: string | number):boolean => {
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

export const compare = (obj0: any, obj1: any): boolean => {
    return Object.keys(obj0).every((key)=>
        Object.prototype.hasOwnProperty.call(obj1, key) && obj0[key] == obj1[key]
    );
}