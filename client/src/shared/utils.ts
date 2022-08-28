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