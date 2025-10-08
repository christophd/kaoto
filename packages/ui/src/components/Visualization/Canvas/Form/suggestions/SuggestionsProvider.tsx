import { useSuggestionRegistry } from '@kaoto/forms';
import { FunctionComponent, PropsWithChildren, useContext, useEffect } from 'react';

import { EntitiesContext, IMetadataApi, MetadataContext } from '../../../../../providers';
import { getPropertiesSuggestionProvider } from './suggestions/properties.suggestions';
import { getSimpleLanguageSuggestionProvider } from './suggestions/simple-language.suggestions';
import { sqlSyntaxSuggestionProvider } from './suggestions/sql.suggestions';
import { getTestVariableSuggestionProvider } from "./suggestions/citrus/test-variable.suggestions";
import { testFunctionSuggestionProvider } from "./suggestions/citrus/test-function.suggestions";
import { testValidationMatcherSuggestionProvider } from "./suggestions/citrus/test-validation-matcher.suggestions";
import { SourceSchemaType } from "../../../../../models/camel";

export const SuggestionRegistrar: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const suggestionRegistry = useSuggestionRegistry();
  const getSuggestions = useContext(MetadataContext)?.getSuggestions ?? GET_SUGGESTIONS_NOOP;
  const entitiesContext = useContext(EntitiesContext);

  useEffect(() => {
    switch (entitiesContext?.currentSchemaType) {
      case SourceSchemaType.Test:
        const testVariableSuggestionProvider = getTestVariableSuggestionProvider(entitiesContext?.camelResource);
        suggestionRegistry?.registerProvider(testVariableSuggestionProvider);
        suggestionRegistry?.registerProvider(testFunctionSuggestionProvider);
        suggestionRegistry?.registerProvider(testValidationMatcherSuggestionProvider);

        return () => {
          suggestionRegistry?.unregisterProvider(testVariableSuggestionProvider.id);
          suggestionRegistry?.unregisterProvider(testValidationMatcherSuggestionProvider.id);
        }
      default:
        const simpleLanguageSuggestionProvider = getSimpleLanguageSuggestionProvider(getSuggestions);
        const propertiesSuggestionProvider = getPropertiesSuggestionProvider(getSuggestions);

        suggestionRegistry?.registerProvider(simpleLanguageSuggestionProvider);
        suggestionRegistry?.registerProvider(propertiesSuggestionProvider);
        suggestionRegistry?.registerProvider(sqlSyntaxSuggestionProvider);

        return () => {
          suggestionRegistry?.unregisterProvider(simpleLanguageSuggestionProvider.id);
          suggestionRegistry?.unregisterProvider(propertiesSuggestionProvider.id);
          suggestionRegistry?.unregisterProvider(sqlSyntaxSuggestionProvider.id);
        };
    }

  }, [getSuggestions, suggestionRegistry]);

  return <>{children}</>;
};

const GET_SUGGESTIONS_NOOP: IMetadataApi['getSuggestions'] = async () => {
  return [];
};
