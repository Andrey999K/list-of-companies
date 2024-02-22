import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks.ts";
import { getCompanyList, updateCompany } from "../../../../store/companySlicer.ts";
import { getEmployeeList } from "../../../../store/employeeSlicer.ts";
import TextField from "../../../common/TextField";
import { Company } from "../../../../types/types.ts";
import includesItem from "../../../../utils/includesItem.ts";

interface TableInterface {
  selectedCompany: Company[];
  setSelectedCompany: React.Dispatch<React.SetStateAction<Company[]>>;
}

const CompaniesTable = ({ selectedCompany, setSelectedCompany }: TableInterface) => {
  const employeeList = useAppSelector(getEmployeeList());
  const companyList = useAppSelector(getCompanyList()).map(company => ({
    ...company,
    countEmployees: employeeList.filter(employee => employee.companyId === company.id).length
  }));
  console.log(companyList);
  const dispatch = useAppDispatch();
  const handlerSelectCompany = (e: React.ChangeEvent<HTMLInputElement>, company: Company) => {
    if (e.target.checked) setSelectedCompany(prevState => [...prevState, company]);
    else setSelectedCompany(prevState => prevState.filter(item => item.id !== company.id));
  };
  const handlerChange = (id: number, name: string, value: string) => {
    dispatch(updateCompany({ id, [name]: value }));
  };
  const handlerSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedCompany(companyList);
    else setSelectedCompany([]);
  };
  return (
    <div className="flex flex-col divide-y-[1px] divide-black/50 w-full max-w-[40%]">
      <div className="flex items-center gap-2 w-full my-4 px-3">
        <input type="checkbox" onChange={handlerSelectAllItems} />
        <div className="w-1/4 font-bold">Название</div>
        <div className="w-1/4 font-bold">Сотрудники</div>
        <div className="w-1/4 font-bold">Адрес</div>
      </div>
      {companyList.map(company => (
        <div
          key={company.id}
          className={`duration-100 px-3 flex items-center py-2 gap-2${
            includesItem(selectedCompany, company) ? " bg-green-400" : ""
          }`}
        >
          <div>
            <input
              type="checkbox"
              checked={includesItem(selectedCompany, company)}
              onChange={e => handlerSelectCompany(e, company)}
            />
          </div>
          <div>
            <TextField value={company.name} name="name" onChange={handlerChange} id={company.id} />
          </div>
          <div>{company.countEmployees}</div>
          <div>{company.address}</div>
        </div>
      ))}
    </div>
  );
};

export default CompaniesTable;
