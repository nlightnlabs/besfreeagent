export const arrayIsEmpty = (arr)=> {    
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        const values = Object.values(obj);
        const allEmpty = values.every(value => value === null || value === undefined || value === "");
        if (!allEmpty) {
            return false; // At least one object has a non-empty value
        }
    }
    return true; // All objects have empty values
}

