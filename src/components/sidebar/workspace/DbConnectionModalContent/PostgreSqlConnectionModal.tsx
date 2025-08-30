import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { TypographyP } from '@/components/ui/typography';

export type DbConnectionModalContentProps = {
  dbProtocol: string;
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  host: z.string().min(1, 'Host is required'),
  port: z.number(),
  authenticationType: z.enum(['User & Password', 'No Authentication']),
  user: z.string().optional(),
  password: z.string().optional(),
  database: z.string(),
});

const PostgreSqlConnectionModal = (props: DbConnectionModalContentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      host: 'localhost',
      port: 5432,
      authenticationType: 'User & Password',
      user: '',
      password: '',
      database: 'postgres',
    },
  });

  const watchedHost = useWatch({ control: form.control, name: 'host' });
  const watchedPort = useWatch({ control: form.control, name: 'port' });
  const watchedDatabase = useWatch({ control: form.control, name: 'database' });
  const watchedUser = useWatch({ control: form.control, name: 'user' });
  const watchedPassword = useWatch({ control: form.control, name: 'password' });
  const watchedAuthenticationType = useWatch({ control: form.control, name: 'authenticationType' });

  useEffect(() => {
    let url = `${props.dbProtocol}://${watchedHost || 'localhost'}:${watchedPort || 5432}`;
    if (watchedAuthenticationType === 'User & Password' && watchedUser) {
      url = `${props.dbProtocol}://${watchedUser}${
        watchedPassword ? `:${'*'.repeat(watchedPassword.length)}` : ''
      }@${watchedHost}:${watchedPort}`;
    }
    if (watchedDatabase) {
      url += `/${watchedDatabase}`;
    }
    setConnectionUrl(url);
    // form.setValue('connectionUrl', url);
  }, [
    watchedHost,
    watchedPort,
    watchedDatabase,
    watchedUser,
    watchedPassword,
    watchedAuthenticationType,
    props.dbProtocol,
    form,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    if (watchedAuthenticationType === 'User & Password') {
      form.register('user');
      form.register('password');
    } else {
      form.unregister('user');
      form.unregister('password');
    }
  }, [watchedAuthenticationType]);

  return (
    <DialogContent className='max-w-2xl gap-8'>
      <DialogHeader>
        <DialogTitle className='flex items-center gap-3'>
          {/* <dbType.icon className='size-7' />
          {dbType.displayName} Connection Configuration */}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Connection name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='host'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='localhost' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='port'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      placeholder='5432'
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='authenticationType'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Authentication Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select authentication method' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='User & Password'>User & Password</SelectItem>
                        <SelectItem value='No Authentication'>No Authentication</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {watchedAuthenticationType === 'User & Password' && (
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='user'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='root' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input {...field} type={showPassword ? 'text' : 'password'} />
                        <Button
                          type='button'
                          variant='icon'
                          size='icon'
                          className='absolute right-0 top-0.5 h-full !bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={form.control}
            name='database'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Database</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='postgres' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TypographyP>{connectionUrl}</TypographyP>

          <div className='flex justify-end gap-4 pt-4'>
            <Button variant='outline'>Test Connection</Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PostgreSqlConnectionModal;
