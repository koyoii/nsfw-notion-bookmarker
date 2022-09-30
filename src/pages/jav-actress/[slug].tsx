import {
  Badge,
  Button,
  ButtonProps,
  Center,
  Chip,
  Code,
  Grid,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconExternalLink,
  IconLetterI,
} from '@tabler/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BadgeLink } from '../../components/BadgeLink';
import Layout from '../../components/Layout';
import { NotionButton } from '../../components/NotionButton';
import { SectionStack } from '../../components/SectionStack';
import dayjs from '../../utils/dayjs';
import { trpc } from '../../utils/trpc';

export default function JavActressPage() {
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const slug = router.query.slug as string;

  const {
    data: actress,
    isLoading: isActressLoading,
    isSuccess: isActressSuccess,
  } = trpc.useQuery(['jav-actress.get', { slug }], {
    enabled: !!slug,
  });

  const { mutate, isLoading: isSaving } = trpc.useMutation(
    ['jav-actress.save'],
    {
      onSuccess: ({ notion }) => {
        trpcContext.invalidateQueries(['jav-actress.get', { slug }]);

        const message = `Actress saved to Notion! ${notion.url}`;
        showNotification({ title: 'Saved to Notion', message });
      },
      onError: (error) => {
        const message = error.message;
        showNotification({
          title: `Failed saving actress: ${slug} to notion`,
          message,
          color: 'red',
        });
      },
    }
  );

  return (
    <Layout>
      <Head>
        <title>JAV Actress | {slug}</title>
      </Head>

      {isActressLoading && (
        <Center style={{ height: '100vh' }}>
          <Loader variant='bars' />
        </Center>
      )}
      {isActressSuccess && (
        <Grid gutter='xl' justify='center'>
          {/* Image */}
          <Grid.Col md='content'>
            <Center>
              <Stack>
                <Image
                  src={`${actress.thumbnail}?fit=cover&width=215&height=300&quality=100`}
                  alt={actress.name}
                  imageProps={{
                    loading: 'lazy',
                  }}
                  radius='md'
                />
                {actress.notion ? (
                  <OpenNotionButton
                    notionUrl={actress.notion.url}
                    openIn='app'
                  />
                ) : (
                  <NotionButton
                    disabled={!!actress.notion}
                    loading={isSaving}
                    onClick={() => mutate({ slug })}
                  >
                    {isSaving
                      ? 'Saving...'
                      : !!actress.notion
                      ? 'Saved'
                      : 'Save'}
                  </NotionButton>
                )}
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col md='auto'>
            {/* Title / Header */}
            <Title mb='md'>
              {actress.name}{' '}
              <Text span inline color='dimmed'>
                ({actress.japanese})
              </Text>
            </Title>
            <Group>
              <Group spacing='xs'>
                <ThemeIcon color='cyan'>
                  <IconBrandTwitter size={20} />
                </ThemeIcon>
                <Text
                  component='a'
                  inline
                  weight={700}
                  href={actress.twitter?.url}
                >
                  {actress.twitter?.username}
                </Text>
              </Group>
              <Group spacing='xs'>
                <ThemeIcon color='pink'>
                  <IconBrandInstagram size={20} />
                </ThemeIcon>
                <Text
                  component='a'
                  inline
                  weight={700}
                  href={actress.twitter?.url}
                >
                  {actress.instagram?.username}
                </Text>
              </Group>
            </Group>
            {/* More details */}
            <Stack mt='md'>
              {/* TOP */}
              <SectionStack title='Personal Info'>
                <Group spacing='lg'>
                  <SectionStack.Children title='Height'>
                    <Text inline>{actress.height}</Text>
                  </SectionStack.Children>

                  <SectionStack.Children title='Bust'>
                    <Text inline>{actress.bust}</Text>
                  </SectionStack.Children>

                  <SectionStack.Children title='Waist'>
                    <Text inline>{actress.waist}</Text>
                  </SectionStack.Children>
                  <SectionStack.Children title='Hip'>
                    <Text inline>{actress.hip}</Text>
                  </SectionStack.Children>
                  <SectionStack.Children title='Cup'>
                    <Text inline weight={700}>
                      {actress.cup}
                    </Text>
                  </SectionStack.Children>
                </Group>

                <Group spacing='lg'>
                  <SectionStack.Children title='Birthdate'>
                    <Text inline>
                      {actress.birthdate
                        ? dayjs(actress.birthdate).format('LL')
                        : '-'}
                    </Text>
                  </SectionStack.Children>
                  <SectionStack.Children title='Blood Type'>
                    <Text inline>{actress.blood_type}</Text>
                  </SectionStack.Children>
                </Group>

                {actress.bio && (
                  <SectionStack.Children title='Bio'>
                    <Text size='md'>
                      {actress.bio.replace(/\sTwitter.*$/, '')}
                    </Text>
                  </SectionStack.Children>
                )}
              </SectionStack>

              <SectionStack title='Extra Info'>
                <SectionStack.Children title='Categories (javlink)'>
                  <Group spacing='xs'>
                    {(actress.categories ?? []).map((category) => (
                      <BadgeLink key={category} url='#'>
                        {category}
                      </BadgeLink>
                    ))}
                  </Group>
                </SectionStack.Children>
              </SectionStack>
            </Stack>
          </Grid.Col>
        </Grid>
      )}
    </Layout>
  );
}

type OpenNotionButtonProps = {
  notionUrl: string;
  openIn?: 'app' | 'web';
} & ButtonProps;
const OpenNotionButton = ({
  notionUrl,
  openIn,
  ...btnProps
}: OpenNotionButtonProps) => {
  return (
    <Button
      component='a'
      rel='noopener noreferrer'
      href={openIn === 'app' ? notionUrl.replace('https', 'notion') : notionUrl}
      variant='white'
      color='dark'
      leftIcon={<IconExternalLink size={20} />}
      {...btnProps}
    >
      {btnProps.children ||
        (openIn === 'app' ? 'Open in Notion' : 'Open in Browser')}
    </Button>
  );
};