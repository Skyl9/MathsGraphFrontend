import { AllNodeData, NomEtranger, Tag } from "../../types/types";
import { Source } from "../../types/ApiTypes/source";
import { Relations } from "../../types/ApiTypes/Relations";
import HtmlField from "./HtmlField";
import AliasesField from "./AliasesField";
import SourcesField from "./SourcesField";
import { NomsEtrangersCollapse } from "./NomsEtrangers";
import RelationsField from "./RelationsField";
import DateField from "./DateField";
import VerifField from "./VerifField";
import TagsField from "./TagsField";
import { Link } from "@mui/material";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

interface Props {
  field: keyof AllNodeData;
  value: unknown;
}

export const NodeFieldRenderer = ({ field, value }: Props) => {
  const { t } = useTranslation();

  switch (field) {
    case "nom":
      return <HtmlField title={"Nom"} content={value as string} />;
    case "demonstration":
      return <HtmlField title={"Démonstration"} content={value as string} />;
    case "enonce":
      return <HtmlField title={"Enoncé"} content={value as string} />;
    case "aliases":
      return <AliasesField aliases={value as string[]} />;
    case "sources":
      return <SourcesField sources={value as Source[]} />;
    case "noms_etrangers":
      return (
        <NomsEtrangersCollapse
          noms={Array.isArray(value) ? (value as NomEtranger[]) : []}
        />
      );
    case "relations":
      return (
        <RelationsField
          relations={Array.isArray(value) ? (value as Relations[]) : []}
        />
      );
    case "id":
      return <HtmlField title={"Id"} content={value as string} />;
    case "categorie":
      return (
        <div className="node-wrapper">
          <div className="field-title">{t("concept.category")}</div>
          <div className="field-content">
            {typeof value === "object" &&
            value !== null &&
            "category" in value ? (
              <Link
                href={
                  "/category/redirect/" +
                  (value as Record<string, unknown>).category
                }
              >
                {" "}
                {(value as Record<string, unknown>).category as string}
              </Link>
            ) : (
              t("concept.no_category")
            )}
          </div>
        </div>
      );
    case "date_ajout":
      return <DateField date={value as string} />;
    case "mathematicien":
      return (
        <div className="node-wrapper">
          <div className="field-title">{t("concept.mathematician")}</div>
          <div className="field-content">
            {typeof value === "object" &&
            value !== null &&
            "mathematicien" in value ? (
              <Link
                href={
                  "/mathematicien/redirect/" +
                  (value as Record<string, unknown>).mathematicien
                }
              >
                {" "}
                {(value as Record<string, unknown>).mathematicien as string}
              </Link>
            ) : (
              t("concept.no_mathematician")
            )}
          </div>
        </div>
      );
    case "verification":
      return <VerifField title={"Vérification"} value={value as string} />;
    case "type":
      return (
        <div className="node-wrapper">
          <div className="field-title">{t("concept.type")}</div>
          <Link href={"/type/redirect/" + value}>
            <div
              className="field-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(String(value)),
              }}
            />
          </Link>
        </div>
      );
    case "tags":
      return <TagsField tags={value as Tag[] | null} />;
    default:
      return <HtmlField title={"Défaut"} content={value as string} />;
  }
};
