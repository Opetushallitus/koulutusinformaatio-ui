import {
  getHakukohde,
  getKoulutus,
  getToteutus,
  getValintaperuste,
} from '#/src/api/konfoApi';
import { useQuery } from 'react-query';

type PageDataProps = {
  hakukohdeOid: string;
};

export type PageData = {
  valintaperuste: any;
  koulutus: any;
  toteutus: any;
  hakukohde: any;
};

// TODO: Backend should return most of the data using getHakukohde()
// * valintaperuste is fetched separately only for metadata, other data already returns on getHakukohde
// * toteutus is fetched only for koulutusOid, other data already returns on getHakukohde
// * koulutus is fetched only for koulutus nimi
// Refactor this to only use getHakukohde when all data is available from the call
const getValintaperustePageData = async ({ hakukohdeOid }: PageDataProps) => {
  const hakukohde = await getHakukohde(hakukohdeOid);
  const { toteutus: hakukohdeToteutus, valintaperuste: hakukohdeValintaperuste } =
    hakukohde ?? {};
  const valintaperuste = await getValintaperuste(hakukohdeValintaperuste?.id);
  const toteutus = await getToteutus(hakukohdeToteutus?.oid);
  const koulutus = await getKoulutus(toteutus?.koulutusOid);

  return { koulutus, toteutus, hakukohde, valintaperuste };
};

export const useValintaperustePageData = ({ hakukohdeOid }: PageDataProps) => {
  return useQuery<PageData>(
    ['getValintaperustePageData', { hakukohdeOid }],
    (_, props: PageDataProps) => getValintaperustePageData(props),
    {
      refetchOnWindowFocus: false,
    }
  );
};

type PreviewPageDataProps = {
  valintaperusteId: string;
};

export type PreviewPageData = {
  valintaperuste: any;
};

const getValintaperustePreviewPageData = async ({
  valintaperusteId,
}: PreviewPageDataProps) => {
  const valintaperuste = await getValintaperuste(valintaperusteId);

  return { valintaperuste };
};

export const useValintaperustePreviewPageData = ({
  valintaperusteId,
}: PreviewPageDataProps) => {
  return useQuery<PreviewPageData>(
    ['getValintaperustePreviewPageData', { valintaperusteId }],
    (_, props: PreviewPageDataProps) => getValintaperustePreviewPageData(props),
    {
      refetchOnWindowFocus: false,
    }
  );
};
