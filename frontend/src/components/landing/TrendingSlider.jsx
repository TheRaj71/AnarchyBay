import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BitShelfProductSlider() {
  const products = [
    {
      title: "React Admin Template",
      price: "₹299",
      desc: "Modern dashboard UI for developers",
      image: "/images/admin-template.png",
      tag: "Best Seller",
    },
    {
      title: "Payments API Wrapper",
      price: "₹499",
      desc: "Simplest way to integrate Razorpay",
      image: "/images/payment-wrapper.png",
      tag: "Trending",
    },
    {
      title: "Tailwind UI Kit — Developer Edition",
      price: "₹199",
      desc: "Premium components for fast dev",
      image: "/images/ui-kit.png",
      tag: "New Release",
    },
  ];

  return (
    <div className="w-full mt-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        navigation
        spaceBetween={40}
        className="pb-10"
      >
        {products.map((p, i) => (
          <SwiperSlide key={i}>
            <div className="
              flex max-w-4xl mx-auto rounded-3xl overflow-hidden
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
              bg-white relative
            ">

              {/* LEFT CONTENT */}
              <div className="p-10 flex-1">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                  {p.tag}
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {p.title}
                </h2>

                <p className="text-slate-600 mt-3">{p.desc}</p>

                <div className="text-3xl font-extrabold text-indigo-600 mt-6">
                  {p.price}
                </div>

                <button className="
                  mt-6 px-6 py-3 rounded-xl bg-indigo-600
                  text-white font-semibold shadow hover:bg-indigo-700
                  transition-all
                ">
                  Buy Now
                </button>
              </div>

              {/* RIGHT IMAGE PREVIEW */}
              <div className="w-[50%] bg-gradient-to-br from-indigo-100/40 to-purple-100/20 flex p-6 items-center justify-center">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full drop-shadow-2xl object-contain"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
