'use client';

import UnifyApi from '@/apis';
import { useOAuthDirect } from '@/hooks';
import axios from 'axios';
import { debounce } from 'lodash';
import { Loader2, LoaderCircle } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input
} from '@/components';

export function AuthPage() {
  const {
    oauthDirectState: { isNewUser, registerForm },
    oauthDirectMethods: { handleRegisterFormSubmit }
  } = useOAuthDirect();

  // An item stands for a loading state
  const loadings = useRef<AbortController[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const checkEmailExistence = async (userId: any) => {
    if (!userId) return;
    setIsLoading(true);
    const controller = new AbortController();
    loadings.current.push(controller);
    // Always get response of api call regardless of success or failure
    const res = await UnifyApi.auth
      .checkUserExist({ userId }, controller.signal)
      .catch(e => e);
    loadings.current.pop();
    const isAccountNotTaken = !res?.data?.data?.existed;
    const isCancelRequest = axios.isCancel(res);
    if (loadings.current.length === 0) {
      setIsLoading(false);
      if (!isCancelRequest) {
        setShowSuccessMessage(isAccountNotTaken);
        console.log('isAccountTaken', !isAccountNotTaken);
        if (isAccountNotTaken) {
          registerForm.clearErrors('accountId');
        } else {
          registerForm.setError('accountId', {
            message: 'Account Id is taken'
          });
        }
      }
    }
  };

  const debouncedCheck = useCallback(debounce(checkEmailExistence, 500), []);

  const handleAccountIdChange = (field: any) => async (e: any) => {
    const value = e.target.value?.toLowerCase();
    field.onChange(value);
    await registerForm.trigger('accountId');
    // cancel prev request
    while (loadings.current.length >= 1) {
      const prevReq = loadings.current.pop();
      if (prevReq) {
        prevReq.abort();
      }
    }
    if (!registerForm.formState.errors.accountId) {
      debouncedCheck(value);
    } else {
      setShowSuccessMessage(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900">
      {!isNewUser ? (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
          <LoaderCircle className="size-15 animate-spin text-gray-200" />
          <p className="text-xl font-semibold text-gray-100">
            Authenticating...
          </p>
        </div>
      ) : (
        <div className="flex h-screen w-full flex-col items-center p-4 text-white">
          <div className="max-w-120">
            <p className="text-text-heading mt-10 pb-2 text-center">
              Create New Account
            </p>
            <Form {...registerForm}>
              <form
                onSubmit={handleRegisterFormSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <FormField
                  control={registerForm.control}
                  name="accountId"
                  rules={{
                    required: 'Account ID is required field',
                    minLength: {
                      value: 4,
                      message:
                        'Account ID must not be shorter than 4 characters.'
                    },
                    maxLength: {
                      value: 15,
                      message:
                        'Account ID must not be longer than 15 characters'
                    },
                    pattern: {
                      value: /^([a-z\d]+[_])*[a-z\d]+([_][a-z\d]+)*$/,
                      message: 'Please enter a valid account ID'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            onBlur={field.onBlur}
                            value={field.value || ''}
                            placeholder="Account ID"
                            onChange={handleAccountIdChange(field)}
                            id="accountId"
                          />
                          <div className="flex items-center gap-2">
                            {isLoading ? (
                              <div className="flex items-center gap-1 text-blue-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p>Validating...</p>
                              </div>
                            ) : registerForm.formState.errors.accountId ? (
                              <p className="text-red-500">
                                {
                                  registerForm.formState.errors.accountId
                                    ?.message
                                }
                              </p>
                            ) : registerForm.formState.isValid ? (
                              <p className="text-green-500">
                                {showSuccessMessage &&
                                  'Congrats! Account ID is available'}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-1 text-sm text-gray-300">
                  <p style={{ scrollSnapMarginBottom: 5 }}>
                    Your account ID <b>CAN</b> contain any of the following:
                  </p>
                  <ul className="mb-lg pl-md list-inside list-disc">
                    <li>Lowercase characters (a-z)</li>
                    <li>Digits (0-9)</li>
                    <li>Character (_) can be used as separators</li>
                  </ul>
                  <p className="pt-2">
                    Your account ID <b>CANNOT</b> contain:
                  </p>
                  <ul className="pl-md list-inside list-disc">
                    <li>Characters “@” or “.”</li>
                    <li>Fewer than 4 characters</li>
                    <li>More than 15 characters</li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  disabled={
                    !registerForm.getValues('accountId') ||
                    !registerForm.formState.isValid ||
                    !!registerForm.formState.errors.accountId ||
                    isLoading ||
                    registerForm.formState.isSubmitting
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
