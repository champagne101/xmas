import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="bg-white dark:bg-[#1a1b1f]/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 transform cursor-pointer hover:scale-105 shadow-lg">
    <div className="flex items-start">
      <div className={`bg-opacity-20 dark:bg-opacity-30 p-3 rounded-full mr-4 ${color}`}>
        <div className="text-white">
          {icon}
          </div>
        </div>
        <div>
        <h3 className="mb-2 text-lg font-semibold text-[#4681ee] dark:text-white">{title}</h3>
        <p className="text-[#4681ee]/70 dark:text-white/70 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

const Services = () => (
  <section >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex md:flex-row flex-col items-start justify-between gap-12">
        <div className="flex-1">
        <h1 className=" text-3xl md:text-4xl font-bold text-[#4681ee] dark:text-white mb-4">
          Services that we
          <span className="block">continue to improve</span>
          </h1>
        <p className="text-[#4681ee]/70 dark:text-white/70 text-lg max-w-2xl">
          The best choice for buying and selling your crypto assets, with the
          various super friendly services we offer
        </p>
      </div>

      <div className="flex-1 space-y-6 w-full">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Security gurantee"
          icon={<BsShieldFillCheck fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Best exchange rates"
          icon={<BiSearchAlt fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Fastest transactions"
          icon={<RiHeart2Fill fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        </div>
      </div>
    </div>
  </section>
);

export default Services;
