import CrudPage from "../components/CrudPage";
export default function Events() {
  return <CrudPage type="events" title="Campus events" subtitle="Explore events and manage event information." searchKey={["title","location","description","date"]} fields={[
    {name:"title",label:"Event title",placeholder:"e.g. Programming contest"},
    {name:"date",label:"Event date",type:"date"},
    {name:"location",label:"Location",placeholder:"e.g. Auditorium"},
    {name:"description",label:"Description",type:"textarea"}
  ]} columns={[{key:"title",label:"Event"},{key:"date",label:"Date"},{key:"location",label:"Location"},{key:"description",label:"Description"}]}/>;
}
