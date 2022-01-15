import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { backendAddress } from "../..";
import Statistics from "../../entities/stats-interface";
import { PageState } from "../../store";


export default function StatisticsPage() {

    const id = useSelector((state:PageState) => state.user.id)

    const [statistics, setStats] =  useState<JSX.Element[][]>([[]]);
    const [show, setShow] = useState<boolean>(false);

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
            setShow(true);
        })()
    },[id]);

    function statsParser(stats:Statistics, name:string) {
        const {employee, reimbursement} = stats.highest;
        const highest = <li className="list-group-item" key={"highest" + name}>Highest Single Reimbursement: <b>${reimbursement.amount}</b> for <b>{reimbursement.type}</b> id: {reimbursement.id} by 
            <b>{` ${employee.fname}`}{employee.mname?` ${employee.mname}`:""}
            {employee.lname?` ${employee.lname}`:""}</b> employeeID: {employee.id}</li>;
        const {amount, employee:employeeHighAvg} = stats.highestAvgByEmployee;
        const highestAvg = <li className="list-group-item" key={"highestAvg" + name}>Highest Avg Reimbursement: <b>${amount}</b> by 
            <b>{` ${employeeHighAvg.fname}`}{employeeHighAvg.mname?` ${employeeHighAvg.mname}`:""}
            {employeeHighAvg.lname?` ${employeeHighAvg.lname}`:""}</b> employeeID: {employeeHighAvg.id}</li>
        const {amount:lowAmount, employee:employeeLowAvg} = stats.lowestAvgByEmployee;
        const lowestAvg = <li className="list-group-item" key={"lowestAvg" + name}>Lowest Avg Reimbursement: <b>${lowAmount}</b> by 
            <b>{` ${employeeLowAvg.fname}`}{employeeLowAvg.mname ? ` ${employeeLowAvg.mname}`:""}
            {employeeLowAvg.lname ? ` ${employeeLowAvg.lname}`:""}</b> employeeID: {employeeLowAvg.id}</li>
        const avgAmount = <li className="list-group-item" key={"avgAmount" + name}>The average reimbursement amount is <b>${stats.avgAmount}</b></li>
        return [highest, highestAvg, lowestAvg, avgAmount];
    }

    return (<>
        {show ? <>
        <h3>Company Wide Statistics</h3>
        <ul className="list-group">{statistics[0]}</ul>
        <h3>Managed Employees Statistics</h3>
        <ul className="list-group">{statistics[1]}</ul>
        <h4>*<em>Statistics do not include employees without reimbursements.</em></h4>
        </> : <h2>Loading Statistics</h2>}
    </>)
}