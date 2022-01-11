import Employee from "./employee";
import ReimbursementItem from "./reimbursement-item";


export default interface Statistics {
    highest:{employee:Employee, reimbursement:ReimbursementItem}
    highestAvgByEmployee:{employee:Employee, amount:number}
    lowestAvgByEmployee:{employee:Employee, amount:number}
    avgAmount:number
}