import CrudPage from "../components/CrudPage";
export default function Notices() {
  return <CrudPage type="notices" title="Notice board" subtitle="Create, search and manage campus announcements." searchKey={["title","category","body"]} fields={[
    {name:"title",label:"Notice title",placeholder:"e.g. Midterm schedule"},
    {name:"category",label:"Category",placeholder:"Academic / General"},
    {name:"date",label:"Publish date",type:"date"},
    {name:"body",label:"Description",type:"textarea"}
  ]} columns={[{key:"title",label:"Title"},{key:"category",label:"Category"},{key:"date",label:"Publish date"},{key:"body",label:"Description"}]}/>;
}
