import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signOut } from '@/hooks/useActions';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <></>;
}
