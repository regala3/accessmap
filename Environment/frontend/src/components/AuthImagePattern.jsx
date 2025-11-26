const AuthImagePattern = ( {title, subtitle} ) => {

  const images = [
    "/pexels-thanh-van-dinh-712218856-28459396.jpg",
    "/unlv_img1.jpeg",
    "/pexels-melissa-220267-698907.jpg",
    "/pexels-nolandlive-34766307.jpg",
    "/pexels-pixabay-433452.jpg",
    "/pexels-soraya-mata-20197344-6536291.jpg",
    "/unlv_img3.jpeg",
    "/pexels-thanh-van-dinh-712218856-28459397.jpg",
    "/unlv_img2.jpeg",
  ]

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="w-lg text-center">
            <div className="grid grid-cols-3 gap-3 mb-8">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-2xl bg-cover bg-center transform transition-transform duration-350 hover:scale-110`}
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}
            </div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-base-content/60">{subtitle}</p>
        </div>
    </div>
  );
};

{/* import { ChevronLeft, ChevronRight } from "lucide-react";
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="carousel w-full">
      <div id="slide1" className="carousel-item relative w-full h-full flex justify-center items-center">
        <img
          src="/casey-horner-k6v6Oy2kmao-unsplash.jpg"
          alt="A small carnival fair in the night time"
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide4" className="btn btn-circle">
            <ChevronLeft/>
          </a>
          <a href="#slide2" className="btn btn-circle">
            <ChevronRight/>
          </a>
        </div>
      </div>
      <div id="slide2" className="carousel-item relative w-full h-full flex justify-center items-center">
        <img
          src="/samantha-gades-fIHozNWfcvs-unsplash.jpg"
          alt="A group of people around a stage underneath a gazebo."
           className="max-h-full max-w-full object-contain"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide1" className="btn btn-circle">
            <ChevronLeft/>
          </a>
          <a href="#slide3" className="btn btn-circle">
            <ChevronRight/>
          </a>
        </div>
      </div>
      <div id="slide3" className="carousel-item relative w-full h-full flex justify-center items-center">
        <img
          src="/kate-trysh-E5xQlNnngO0-unsplash.jpg"
          alt="An outdoor event filled with people"
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide2" className="btn btn-circle">
            <ChevronLeft/>
          </a>
          <a href="#slide4" className="btn btn-circle">
            <ChevronRight/>
          </a>
        </div>
      </div>
      <div id="slide4" className="carousel-item relative w-full h-full flex justify-center items-center">
        <img
          src="/andy-wang-o_82Kgh6DXU-unsplash.jpg"
          alt="Small college outdoor event with colorful building in the background"
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide3" className="btn btn-circle">
            <ChevronLeft/>
          </a>
          <a href="#slide1" className="btn btn-circle">
            <ChevronRight/>
          </a>
        </div>
      </div>
    </div>
  );
}; */}

export default AuthImagePattern;
