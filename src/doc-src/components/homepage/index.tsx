import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <main className="">
        <div className="hero shadow--lw">
          <div className="container">
            <h1 className="hero__title">{siteConfig.title || ""}</h1>
            <p className="hero__subtitle">{siteConfig.tagline || ""}</p>
            <div>
              <button className="button button--outline button--lg mt-8 bg-purple-700 text-white">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
