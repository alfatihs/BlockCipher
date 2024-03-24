import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Flex,
  Toast,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { CipherType } from "@/lib/CipherType";
import {
  decryptFileApi,
  decryptStringApi,
  encryptFileApi,
  encryptStringApi,
} from "@/api/api";
import { AxiosError } from "axios";
import { start } from "repl";

export default function Homepage() {
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [encryptionType, setEncryptionType] = useState(CipherType.CBC);
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState(0);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleEncrypt = async () => {
    const startTime = new Date().getTime();
    try {
      setLoading(true);
      if (inputType === "text") {
        const result = await encryptStringApi(encryptionType, key, inputValue);
        setResult(result);
      } else if (file != null) {
        await encryptFileApi(encryptionType, key, file);
      }
      setLoading(false);
      const endTime = new Date().getTime();
      setExecTime(endTime - startTime);
    } catch (e) {
      setLoading(false);
      const endTime = new Date().getTime();
      setExecTime(endTime - startTime);
      if (e instanceof AxiosError) {
        toast({
          status: "error",
          title: "Error",
          description: `${e.response?.data.message ?? e.message}`,
        });
        return;
      }

      toast({
        status: "error",
        title: "Error",
        description: `${(e as any).message}`,
      });
    }
  };

  const handleDecrypt = async () => {
    const startTime = new Date().getTime();
    try {
      setLoading(true);
      if (inputType === "text") {
        const result = await decryptStringApi(encryptionType, key, inputValue);
        setResult(result);
      } else if (file != null) {
        await decryptFileApi(encryptionType, key, file);
      }
      setLoading(false);
      const endTime = new Date().getTime();
      setExecTime(endTime - startTime);
    } catch (e) {
      setLoading(false);
      const endTime = new Date().getTime();
      setExecTime(endTime - startTime);
      if (e instanceof AxiosError) {
        toast({
          status: "error",
          title: "Error",
          description: `${e.response?.data.message ?? e.message}`,
        });
        return;
      }

      toast({
        status: "error",
        title: "Error",
        description: `${(e as any).message}`,
      });
    }
  };

  const handleClear = () => {
    setInputType("text");
    setInputValue("");
    setKey("");
    setEncryptionType(CipherType.CBC);
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading mb={4}>Block Cipher</Heading>
        <Text mb={4}>by: Azmi Alfatih Shalahuddin 13520158</Text>
        <Text mb={4}>and Bayu Samudra 13520128</Text>

        <FormControl mb={4}>
          <FormLabel>Block Cipher Mode</FormLabel>
          <Select
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value as CipherType)}
          >
            <option value={CipherType.CBC}>CBC</option>
            <option value={CipherType.OFB}>OFB</option>
            <option value={CipherType.CFB}>CFB</option>
            <option value={CipherType.CTR}>Counter</option>
            <option value={CipherType.ECB}>ECB</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Input Type</FormLabel>
          <Select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="file">File</option>
          </Select>
        </FormControl>

        {inputType === "text" ? (
          <FormControl mb={4}>
            <FormLabel>Input Text</FormLabel>
            <Textarea value={inputValue} onChange={handleInputChange} />
          </FormControl>
        ) : (
          <FormControl mb={4}>
            <FormLabel>Upload File</FormLabel>
            <Input
              type="file"
              onChange={(el) =>
                setFile(
                  el.currentTarget.files ? el.currentTarget.files[0] : null
                )
              }
            />
          </FormControl>
        )}

        <FormControl mb={4}>
          <FormLabel>Key</FormLabel>
          <Textarea value={key} onChange={(e) => setKey(e.target.value)} />
        </FormControl>

        <Flex>
          <Button
            colorScheme="blue"
            mr={2}
            onClick={handleEncrypt}
            isLoading={loading}
          >
            Encrypt
          </Button>
          <Button
            colorScheme="blue"
            mr={2}
            onClick={handleDecrypt}
            isLoading={loading}
          >
            Decrypt
          </Button>
          <Button colorScheme="gray" onClick={handleClear} isLoading={loading}>
            Clear
          </Button>
        </Flex>
        <Box mt={5}>
          <Heading as="h2" size="md">
            Waktu Eksekusi
          </Heading>
          <Text>Execution Time : {execTime} ms</Text>
          <Heading as="h2" size="md">
            Hasil
          </Heading>
          <Text>{result}</Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
