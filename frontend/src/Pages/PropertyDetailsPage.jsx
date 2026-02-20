import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";

function PropertyDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axiosInstance.get(
          `/api/projects/getSingleProject/${slug}`
        );
        setProject(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{project.project_name}</h1>
      <p>{project.project_location}</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {project.images?.map((img, i) => (
          <img key={i} src={img.image_url} alt="" />
        ))}
      </div>
    </div>
  );
}

export default PropertyDetailsPage;