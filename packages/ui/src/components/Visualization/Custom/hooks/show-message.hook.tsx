import { useCallback, useContext, useMemo } from 'react';
import { IVisualizationNode } from '../../../../models/visualization/base-visual-entity';
import { CatalogModalContext } from '../../../../dynamic-catalog/catalog-modal.provider';
import { EntitiesContext } from '../../../../providers/entities.provider';
import { MetadataContext } from '../../../../providers/metadata.provider';

export const useShowMessage = (
  vizNode: IVisualizationNode | undefined
) => {
  const entitiesContext = useContext(EntitiesContext);
  const catalogModalContext = useContext(CatalogModalContext);
  const metadataContext = useContext(MetadataContext);

  const onShowMessage = useCallback(async () => {
    /** Get message content */
    const message = vizNode?.getMessage();
    if (!message) {
      return {} as Record<string, unknown>;
    }
    return message;
  }, [catalogModalContext, entitiesContext, metadataContext, vizNode]);

  const value = useMemo(
    () => ({
      onShowMessage,
    }),
    [onShowMessage],
  );

  return value;
};
