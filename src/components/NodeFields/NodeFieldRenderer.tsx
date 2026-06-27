import { AllNodeData } from "../../types/types";
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
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

type FieldProps = {
  [K in keyof AllNodeData]-?: {
    field: K;
    value: AllNodeData[K] | undefined | null;
  };
}[keyof AllNodeData];

export const NodeFieldRenderer = (props: FieldProps) => {
  const { t } = useTranslation();

  switch (props.field) {
    case "nom":
      return <HtmlField title={"Nom"} content={props.value ?? ""} />;
    case "demonstration":
      return <HtmlField title={"Démonstration"} content={props.value ?? ""} />;
    case "enonce":
      return <HtmlField title={"Enoncé"} content={props.value ?? ""} />;
    case "aliases":
      return <AliasesField aliases={props.value || []} />;
    case "sources":
      return <SourcesField sources={props.value || []} />;
    case "noms_etrangers":
      return <NomsEtrangersCollapse noms={props.value || []} />;
    case "relations":
      return <RelationsField relations={props.value || []} />;
    case "id":
      return <HtmlField title={"Id"} content={String(props.value)} />;
    case "categorie":
      return (
        <FieldWrapper>
          <FieldTitle>{t("concept.category")}</FieldTitle>
          <FieldContent>
            {props.value ? (
              <Link href={"/category/redirect/" + props.value.category}>
                {" "}
                {props.value.category}
              </Link>
            ) : (
              t("concept.no_category")
            )}
          </FieldContent>
        </FieldWrapper>
      );
    case "date_ajout":
      return <DateField date={props.value || ""} />;
    case "mathematicien":
      return (
        <FieldWrapper>
          <FieldTitle>{t("concept.mathematician")}</FieldTitle>
          <FieldContent>
            {props.value ? (
              <Link
                href={"/mathematicien/redirect/" + props.value.mathematicien}
              >
                {" "}
                {props.value.mathematicien}
              </Link>
            ) : (
              t("concept.no_mathematician")
            )}
          </FieldContent>
        </FieldWrapper>
      );
    case "verification":
      return <VerifField title={"Vérification"} value={String(props.value)} />;
    case "type":
      return (
        <FieldWrapper>
          <FieldTitle>{t("concept.type")}</FieldTitle>
          <Link href={"/type/redirect/" + props.value}>
            <FieldContent
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(String(props.value || "")),
              }}
            />
          </Link>
        </FieldWrapper>
      );
    case "tags":
      return <TagsField tags={props.value || null} />;
    default:
      return <HtmlField title={"Défaut"} content={String(props.value || "")} />;
  }
};
