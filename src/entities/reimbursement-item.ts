
export enum ReimbursementStatus {
    pending = "pending", approved = "approved", denied = "denied"
}

/** 
 * @property {string} type - what the reimbursement falls under, such as gas, lunch, skydiving, etc.
 * @property {string} desc - short description of what is to be reimbursed
*/
export default interface ReimbursementItem {
    id:string,
    employeeId:string,
    type:string,
    desc:string,
    amount:number,
    status:ReimbursementStatus
    //file uploads if possible
}