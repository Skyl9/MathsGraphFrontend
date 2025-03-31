import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import {Link} from "react-router-dom";
import {ZIPS_COMPRESSION} from "three/examples/jsm/exporters/EXRExporter";

interface NodeDetailsProps {
    position: [number, number, number];
    nom: string;
    typeMath: string;
    id: number;
}

export default function NodeDetails({ position, nom, typeMath,id }: NodeDetailsProps) {
    return (
        <Html position={position}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: "rgba(255, 255, 255, 0.8)", // Semi-transparent
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    textAlign: "center",
                }}
            >
                <a href={"/node/"+id}>
                    <h3 style={{ margin: 0 }}>{nom}</h3>
                </a>
                    <p style={{ margin: 0 }}>Type : {typeMath}</p>

            </motion.div>
        </Html>
    );
}
