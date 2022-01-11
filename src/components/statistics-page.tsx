import { useEffect, useState } from "react"
import { backendAddress } from "..";
import Statistics from "../entities/stats-interface";


export default function StatisticsPage() {

    const [statistics, setStats] =  useState<JSX.Element[]>();

    useEffect(() => {
        
        (async () => {
            const response = await fetch(`${backendAddress}/stats`);
            if(!response || !(response.ok)) {
                alert('There was an error communicating with the server.');
                return;
            }
            const returnedStats:Statistics = await response.json();
            let newStats = statsParser(returnedStats);
            setStats(newStats);
        })()
    },[]);

    function statsParser(stats:Statistics) {
        const {employee, reimbursement} = stats.highest;
        const highest = <li key={"highest"}>Highest Single Reimbursement: ${reimbursement.amount} for {reimbursement.type} id: {reimbursement.id} by 
            {` ${employee.fname}`}{` ${employee.mname}` ?? ""}{(` ${employee.lname} `) ?? ""} employeeID: {employee.id}</li>;
        const {amount, employee:employeeHighAvg} = stats.highestAvgByEmployee;
        const highestAvg = <li key={"highestAvg"}>Highest Avg Reimbursement: ${amount} by 
            {` ${employeeHighAvg.fname}`}{` ${employeeHighAvg.mname}` ?? ""}{` ${employeeHighAvg.lname}` ?? ""} employeeID: {employeeHighAvg.id}</li>
        const {amount:lowAmount, employee:employeeLowAvg} = stats.lowestAvgByEmployee;
        const lowestAvg = <li key={"lowestAvg"}>Lowest Avg Reimbursement: ${lowAmount} by 
        {` ${employeeLowAvg.fname}`}{` ${employeeLowAvg.mname}` ?? ""}{` ${employeeLowAvg.lname}` ?? ""} employeeID: {employeeLowAvg.id}</li>
        const avgAmount = <li key={"avgAmount"}>The average reimbursement amount for the company is ${stats.avgAmount}</li>
        return [highest, highestAvg, lowestAvg, avgAmount];
    }

    return (<>
        <h3>Company Wide Statistics</h3>
        <ul >{statistics}</ul>
    </>)
}