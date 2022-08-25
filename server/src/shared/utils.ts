export const isDigit = (num: number) => {
    return num >= 0 && num <= 9;
}

export const randRange = (min: number, max: number) => {
    return min + Math.random() * (max - min);
}