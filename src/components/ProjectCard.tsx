import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
  image?: string;
  stats?: { label: string; value: string }[];
  className?: string;
}

export function ProjectCard({ title, description, tag, icon, image, stats, className }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all duration-500 border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity duration-500">
        {icon}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {image && (
          <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-surface-container-highest">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div className={cn("flex-1", image ? "w-full md:w-2/3" : "w-full")}>
          <h3 className="text-primary font-headline text-2xl font-bold mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-4">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-wider">
              {tag}
            </span>
            {stats?.map((stat, i) => (
              <span key={i} className="text-[10px] font-mono bg-secondary/10 text-secondary-bright px-2 py-1 rounded uppercase tracking-wider">
                {stat.value} {stat.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
