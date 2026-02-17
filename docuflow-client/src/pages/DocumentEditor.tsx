import { useParams } from "react-router-dom";

export const DcoumentEditor = () => {
  const { id } = useParams();
  
  return
(  <>
  <div className="text-white p-8">
    <h1 className="text-3xl font-bold"> Editing Document </h1>
    <p className="text-gray-400 mt-2"> ID: { id}</p>
      
    </div>
    
  </>
)
  
}