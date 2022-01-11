import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { backendAddress } from "..";
import Statistics from "../entities/stats-interface";
import { PageState } from "../store";


export default function StatisticsPage() {

    const id = useSelector((state:PageState) => state.user.id)

    const [statistics, setStats] =  useState<JSX.Element[][]>([[]]);

    useEffect(() => {
        
        (async () => {
            const response = await fetch(`${backendAddress}/stats/${id}`);
            if(!response || !(response.ok)) {
                alert('There was an error communicating with the server.');
                return;
            }
            const {companyStats, managedStats} = await response.json();
            const parsedCompanyStats = statsParser(companyStats, "company");
            const parsedManagedStats = statsParser(managedStats, "managed");
            setStats([parsedCompanyStats, parsedManagedStats]);
        })()
    },[id]);

    function statsParser(stats:Statistics, name:string) {
        const {employee, reimbursement} = stats.highest;
        const highest = <li key={"highest" + name}>Highest Single Reimbursement: ${reimbursement.amount} for {reimbursement.type} id: {reimbursement.id} by 
            {` ${employee.fname}`}{employee.mname?` ${employee.mname}`:""}
            {employee.lname?` ${employee.lname}`:""} employeeID: {employee.id}</li>;
        const {amount, employee:employeeHighAvg} = stats.highestAvgByEmployee;
        const highestAvg = <li key={"highestAvg" + name}>Highest Avg Reimbursement: ${amount} by 
            {` ${employeeHighAvg.fname}`}{employeeHighAvg.mname?` ${employeeHighAvg.mname}`:""}
            {employeeHighAvg.lname?` ${employeeHighAvg.lname}`:""} employeeID: {employeeHighAvg.id}</li>
        const {amount:lowAmount, employee:employeeLowAvg} = stats.lowestAvgByEmployee;
        const lowestAvg = <li key={"lowestAvg" + name}>Lowest Avg Reimbursement: ${lowAmount} by 
            {` ${employeeLowAvg.fname}`}{employeeLowAvg.mname ? ` ${employeeLowAvg.mname}`:""}
            {employeeLowAvg.lname ? ` ${employeeLowAvg.lname}`:""} employeeID: {employeeLowAvg.id}</li>
        const avgAmount = <li key={"avgAmount" + name}>The average reimbursement amount is ${stats.avgAmount}</li>
        return [highest, highestAvg, lowestAvg, avgAmount];
    }

    return (<>
        <h3>Company Wide Statistics</h3>
        <ul >{statistics[0]}</ul>
        <h3>Managed Employees Statistics</h3>
        <ul>{statistics[1]}</ul>
        <h4>*<em>Statistics do not include employees without reimbursements.</em></h4>
    </>)
}