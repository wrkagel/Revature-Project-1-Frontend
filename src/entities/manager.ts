import Employee from "./employee";

/**
 * @property {string[]} manages should contain a list of employee id strings that identify the employees managed by this manager
 */
export default interface Manager extends Employee {
    manages:string[]
}