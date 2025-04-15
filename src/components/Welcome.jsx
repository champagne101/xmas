import React, { useContext, useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import fs from "fs"; 

//import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import $u from '../utils/$u.js';
import { ethers } from "ethers";
import wc from "../circuit/witness_calculator.js";
import tornadoJSON from "../json/Tornado.json";
import UzarTokenABI from "../json/abizar.json";

import QRCode from "qrcode";
// import QrReader from "react-qr-reader";


// eyJyb290IjoiMTM4MTc0NzcxNTEyMTYwNDExNzc0Mjk4Mjc2OTgzOTk1NzEyMjE3OTM1Nzk3MDQ4ODIzMzA1MjIzNjgzOTQ5MDQ5MTE4Mjk3Mzk1NzMiLCJudWxsaWZpZXJIYXNoIjoiMTIzMDAxMjI4MDQ1OTY5MjczMTUwOTIwMjY0MTcxNTUyMzc5ODg5Nzg3ODE3NDMxNDU2NjA3NDA4OTcwOTU1MTUzNTczMTI3MTE2NTQiLCJzZWNyZXQiOiIzMzE4NjYxMzM0ODU0MzQxODMyMTUwNDE0MDUzNjM5NzI4NjMxOTkwNzE3MzkxNDgxMDMxNjM3ODQ2ODIyMzU4MTUzMjE0Njg1MzYyMCIsIm51bGxpZmllciI6IjM0OTg3OTkxMjcwMjA2NzA5NzQ5OTQ5OTE0MDUzNTYyMzEwMDI4NTQ3NDAyNDcwNDg5NjA4MDc1Mzg0MDcwMjA2NTEyODcxNTc2MjU3IiwiY29tbWl0bWVudCI6IjI1MjA3MDgyMTM5NDI0NTA3NTY4OTU3NzE5MDA3NzcyMzc3MDY4MDA2NTY1MTY3NTg4NDE0NjAwNjk3ODA1OTU2NzUwNzIwMzAwMSIsImhhc2hQYWlyaW5ncyI6WyIyMzE4Mzc3MjIyNjg4MDMyODA5Mzg4NzIxNTQwODk2NjcwNDM5OTQwMTkxODgzMzE4ODIzODEyODcyNTk0NDYxMDQyODE4NTQ2NjM3OSIsIjI0MDAwODE5MzY5NjAyMDkzODE0NDE2MTM5NTA4NjE0ODUyNDkxOTA4Mzk1NTc5NDM1NDY2OTMyODU5MDU2ODA0MDM3ODA2NDU0OTczIiwiMTg3ODU0NzMwOTI4MTI0NTA0OTU1NzMxNTg1MjkxODk2MjkxNjE5MDY4NjUzNzM0MDc2MjU3NDQ4MjM0MDMyOTIwMzAyMzM3NjAxMDYiLCI4NDk3NjM5OTI4NjQ2Njc4NjM3Nzc0NDY1NDk5MjQ3MzUyMjA0NTI0MjczMjIxMjI0MDY3Mjg0NTA2NDUzMzEzMzI5MTU1OTUyMzc0IiwiNjg5NDI0MTkzNTE1MDkxMjY0NDg1NzA3NDAzNzQ3NDcxODE5NjU2OTY3MTQ0NTg3NzUyMTQ5MzkzNDUyMjE4ODUyODIxMTM0MDQ1MDUiLCIxNTU1OTMxODE4MDg3ODE2MzkwMzcxODM0NzU0MTU5NDAwMjg5NjUxMTcxMDE4NjAxNjQ3NzA2MDA5MTQ1NTcyMjUwNTkyMjUzNDc5NyIsIjczMTgyNDIxNzU4Mjg2NDY5MzEwODUwODQ4NzM3NDExOTgwNzM2NDU2MjEwMDM4NTY1MDY2OTc3NjgyNjQ0NTg1NzI0OTI4Mzk3ODYyIiwiNjAxNzY0MzExOTc0NjExNzA2Mzc2OTI4ODI5NTU2Mjc5MTc0NTY4MDA2NDg0NTg3NzI0NzIzMzE0NTE5MTg5MDg1Njg0NTUwMTY0NDUiLCIxMDU3NDA0MzA1MTU4NjI0NTczNjA2MjMxMzQxMjYxNzk1NjExNTM5OTM3Mzg3NzQxMTU0MDA4NjE0MDA2NDkyMTUzNjA4MDcxOTc3MjYiLCI3Njg0MDQ4Mzc2NzUwMTg4NTg4NDM2ODAwMjkyNTUxNzE3OTM2NTgxNTAxOTM4MzQ2Njg3OTc3NDU4NjE1MTMxNDQ3OTMwOTU4NDI1NSJdLCJoYXNoRGlyZWN0aW9uIjpbMCwwLDEsMSwwLDEsMCwwLDAsMF0sInR4SGFzaCI6IjB4MWUxOGIwNGJjYWQ4MjVlMTIxNGE4MzBhMzY1YWIwZGRkYTRlMzFiOWYzZTlmMzAwYjA0MTI0NzcwMjUwYzUwMiJ9
// eyJyb290IjoiMTA4MzIzODk0NjcwMDM5NTMxMTExMTU1MjE3MDgzMjU5MDUyODA4ODQ5MDgwMTI4NjE4OTg2NTM3NjQ3OTk5OTY4OTY1Mjc3MDM3MSIsIm51bGxpZmllckhhc2giOiIxNzU0NTQ0NzM2NTQwNDYyNTI1NDQ1NzAwNjgwODk0MzMxMzU2NDE3MTQxNjg4MTU2NjgxNjE5MDg1MTY3ODc4NzU1Nzc0MzcxOTk2NyIsInNlY3JldCI6IjUzMjQ0ODYwNTk3ODgxNTc3NzUwOTkxNDkwOTA5NzU0MzQ1NzM1OTg1MTQ5NDI5ODQ1NjcxODg4NTQzNjE1Nzk5NzE4OTcwMzQwNDYwIiwibnVsbGlmaWVyIjoiMTIwMDgxNDU3MTQ0MzQ0MDk3NzYyNDM5ODQ5OTk0Njg0NDg5NTI5NTYwMTg0NTE4MjYwNzczMzkyMDExNTk3MTg0OTg5MzE4OTQyMjEiLCJjb21taXRtZW50IjoiMjExMjk5Mzk3NzQ0MTkzMTg2MzMwNDI3ODc1OTYxNTMyMjU4OTI0MDI0Nzk5NDU3MzU2MTE0NDAyNTE2ODkyOTE1NDg2MTA4MTA0NjIiLCJoYXNoUGFpcmluZ3MiOlsiMjMxODM3NzIyMjY4ODAzMjgwOTM4ODcyMTU0MDg5NjY3MDQzOTk0MDE5MTg4MzMxODgyMzgxMjg3MjU5NDQ2MTA0MjgxODU0NjYzNzkiLCI4NjM4MjU4MTgyOTY5MDU5OTczODU3MzE5MTE3ODkzMDc0MjMxNDc5NDU5MDg4NTg5NjExNjA2MzQxMjAzODgzMTk4MTg5Mjc3NDgwIiwiMjE3MjI1NTY0MzY4MTY3ODcwNDA3MTg3NTQ0Mjc3NTg4NjMxNDMyNTY1ODE4NDIwODI1OTI2MjkzODA0MDAxODA5NjIyOTkzNjA3ODkiLCI5MjI1ODcxNDAwNDQzODQyMDE2MTEwODQzOTY2NzE2ODAxOTU2OTAwNjc1NTA3NzA4NzAxMDIzNzI1NjAxNDg5NzM5NzU1NDkxNTk4IiwiNjg5NDI0MTkzNTE1MDkxMjY0NDg1NzA3NDAzNzQ3NDcxODE5NjU2OTY3MTQ0NTg3NzUyMTQ5MzkzNDUyMjE4ODUyODIxMTM0MDQ1MDUiLCIxNTgyMDYxODcwNTQyNzE4MjQ5MzYzMzIyNDAzMDY2ODM2NjMyNzI0MDcxNDU0OTAyMTEyMDg1NDM5Mjk0NzI3NjMzNDk5NDkzMzUzNiIsIjczMTgyNDIxNzU4Mjg2NDY5MzEwODUwODQ4NzM3NDExOTgwNzM2NDU2MjEwMDM4NTY1MDY2OTc3NjgyNjQ0NTg1NzI0OTI4Mzk3ODYyIiwiNjAxNzY0MzExOTc0NjExNzA2Mzc2OTI4ODI5NTU2Mjc5MTc0NTY4MDA2NDg0NTg3NzI0NzIzMzE0NTE5MTg5MDg1Njg0NTUwMTY0NDUiLCIxMDU3NDA0MzA1MTU4NjI0NTczNjA2MjMxMzQxMjYxNzk1NjExNTM5OTM3Mzg3NzQxMTU0MDA4NjE0MDA2NDkyMTUzNjA4MDcxOTc3MjYiLCI3Njg0MDQ4Mzc2NzUwMTg4NTg4NDM2ODAwMjkyNTUxNzE3OTM2NTgxNTAxOTM4MzQ2Njg3OTc3NDU4NjE1MTMxNDQ3OTMwOTU4NDI1NSJdLCJoYXNoRGlyZWN0aW9uIjpbMCwxLDEsMSwwLDEsMCwwLDAsMF0sInR4SGFzaCI6IjB4Yjk3NDBmMTlmNGVhNTc5MzI4ODVkZTUxNGEzNDI4YWVmZmIwOWRiNzcwNjg3NzAwNjI5ZmRjYWU0OTk2YTc1ZCJ9 spent
// eyJyb290IjoiMTAzMTc1NjI1NDM1OTExMTM2MzUzMzAwMjA4OTE2OTIyNjEzMzcyMzIwNjY4MjQ5NDgwNTIwNTQ4OTkxMzMzMzg5MTg3NTcyMDY2MjkiLCJudWxsaWZpZXJIYXNoIjoiMTU5Nzg0ODgzMDg1NTY3MzMzMTgwNzgxOTYyMjg0OTMzODM1NTMzOTc3MTA0MzY2ODk5NzEzNzExMzU5NDEzMTIyNTUyMTkzNzY3MDciLCJzZWNyZXQiOiI1NjkxNDQ2MzEwNTMyMDAzODk4MTYxOTk4MTEzODMwNzM2MDg4MzU4MjY5NjkwODE3NTc1MzAzMjczMzY1MDQ2NzczNDU3MTM3MTgwMSIsIm51bGxpZmllciI6IjQ1NTk3NTQwMDAxMjczMDc2MTA0ODMyMzU2MjQ4MjM1ODUwOTI3NjEwMjY0MTY1NzI3MjY1ODkxMDU0Nzc3MDUzMDEzODUyNDcwNTE2IiwiY29tbWl0bWVudCI6IjMxMDIwMjIxNDQwOTc2OTcyOTMzNjM3MDA0MzI2ODY1NDYwNDU1NTE0MzM1MzMxMjExNjc3NDY2Nzc1NDQ0MjY1MDQ0NDkyOTg5MTUiLCJoYXNoUGFpcmluZ3MiOlsiMjExMjk5Mzk3NzQ0MTkzMTg2MzMwNDI3ODc1OTYxNTMyMjU4OTI0MDI0Nzk5NDU3MzU2MTE0NDAyNTE2ODkyOTE1NDg2MTA4MTA0NjIiLCIyMDYzNDUwMTk4NTg5OTEyMTg5ODA0MDQ0NzY2ODE3OTYxOTI1MDY1MjU5Mjg2MTkxMTYyMjc1NzQxNjIyOTIwMjE5MDAxOTQ3MTI0MyIsIjY0MDA1MjY2NTYwMDcxODA2MzMxOTI1MTg3NTQzNzkxOTI3MTQyODQzNzMxMzQ5ODkxNjQzMzIwNjI5NDEwNjQ0NDY0NDgyMDY5MjQiLCI2NTk0MTUwNDU5ODI5ODg4NDgxMDMwNDc2OTU3NzUwNzEwNTkzNTU0NjIxMDM1OTM1MDEyMDU2NTk3MDkzNDMwNTMxNDIzNzQxNTA4IiwiNjg5NDI0MTkzNTE1MDkxMjY0NDg1NzA3NDAzNzQ3NDcxODE5NjU2OTY3MTQ0NTg3NzUyMTQ5MzkzNDUyMjE4ODUyODIxMTM0MDQ1MDUiLCIxMDE1MDgxNzg0MzQxODMwMDA1NTUwMTg4MjMxMjU3OTY4ODg3MTA5NTUwODAwMjAxNjcyNTM0OTA0MTA5NDQ5MjUyNzY3NDIwMTE4NSIsIjczMTgyNDIxNzU4Mjg2NDY5MzEwODUwODQ4NzM3NDExOTgwNzM2NDU2MjEwMDM4NTY1MDY2OTc3NjgyNjQ0NTg1NzI0OTI4Mzk3ODYyIiwiNjAxNzY0MzExOTc0NjExNzA2Mzc2OTI4ODI5NTU2Mjc5MTc0NTY4MDA2NDg0NTg3NzI0NzIzMzE0NTE5MTg5MDg1Njg0NTUwMTY0NDUiLCIxMDU3NDA0MzA1MTU4NjI0NTczNjA2MjMxMzQxMjYxNzk1NjExNTM5OTM3Mzg3NzQxMTU0MDA4NjE0MDA2NDkyMTUzNjA4MDcxOTc3MjYiLCI3Njg0MDQ4Mzc2NzUwMTg4NTg4NDM2ODAwMjkyNTUxNzE3OTM2NTgxNTAxOTM4MzQ2Njg3OTc3NDU4NjE1MTMxNDQ3OTMwOTU4NDI1NSJdLCJoYXNoRGlyZWN0aW9uIjpbMSwxLDEsMSwwLDEsMCwwLDAsMF0sInR4SGFzaCI6IjB4YTYwZGEyZjA1OWY3NjY1MmE0NzMxZjJkZDY3ODExMmY5MDFiYTVhM2E0MzdkZDBjYzc2NmY2NGRkMjRjZWE0NCJ9


// lisk eyJyb290IjoiMTk1MzA0MjE2MTkxMTUzNDM4MDYyNDczNDY4MjQ1ODM3MTE3MDQ1ODk1NzAzODg4NDMwNTM3OTEyNDgxMjY5ODEwNTI4MTU2ODgwNDEiLCJudWxsaWZpZXJIYXNoIjoiMjk4NTU3MzA0Mjg5Nzc4MTE4MDM1OTczOTYxNTA2ODAzNTA5NjE3NjM1NzE4MjU4MjczMjM0ODgxNjU5ODAxODIzNTQxOTgzNjg5MSIsInNlY3JldCI6IjExMzY5Nzc0MjE1NDYwNjUyNjIxNjE4ODYzODIzOTU0NzcxMjE2ODI3NzMxMjcwMTYxMjI4OTAwNTE4MTYxODY4MjQyNTM3NzMyMjc2IiwibnVsbGlmaWVyIjoiMTYwMDY0NzQ2MzYwMTY5MTE3MTY4Nzk5NzIxOTU1Mjc0NjU4NTEyNTUxMzA5MDMyODY1Njc1MTMzNzY1OTE3MzI2MDkwNzY1MDg2ODMiLCJjb21taXRtZW50IjoiODM2MDg3MjUxOTQwODE2Mzk3OTE3Njk5NTYyNjMwNDkxNzkzMjk0MzU0NjQ4NDk0NDQyMjI0ODcwNTg4NTQ1OTk4NTc2NjU1MjYwOCIsImhhc2hQYWlyaW5ncyI6WyI2OTIyMzY2NTQ4MzY1Mjk1MjkzNzQxOTkxNTk1NTc4MDUzMjk1MjQ4MzE2NzkyMDUwMjAzOTUzNTU1MDA5MzEwMjA0MjM1MzYyMjgiLCIyNDAwMDgxOTM2OTYwMjA5MzgxNDQxNjEzOTUwODYxNDg1MjQ5MTkwODM5NTU3OTQzNTQ2NjkzMjg1OTA1NjgwNDAzNzgwNjQ1NDk3MyIsIjkwNzY3NzM1MTYzMzg1MjEzMjgwMDI5MjIxMzk1MDA3OTUyMDgyNzY3OTIyMjQ2MjY3ODU4MjM3MDcyMDEyMDkwNjczMzk2MTk2NzQwIiwiMzY4Mzg0NDY5MjI5MzM3MDIyNjYxNjEzOTQwMDAwMDY5NTY3NTYwNjE4OTk2NzM1NzY0NTQ1MTM5OTIwMTM4NTMwOTMyNzY1Mjc4MTMiLCI2ODk0MjQxOTM1MTUwOTEyNjQ0ODU3MDc0MDM3NDc0NzE4MTk2NTY5NjcxNDQ1ODc3NTIxNDkzOTM0NTIyMTg4NTI4MjExMzQwNDUwNSIsIjUwMDgyMzg2NTE1MDQ1MDUzNTA0MDc2MzI2MDMzNDQyODA5NTUxMDExMzE1NTgwMjY3MTczNTY0NTYzMTk3ODg5MTYyNDIzNjE5NjIzIiwiNzMxODI0MjE3NTgyODY0NjkzMTA4NTA4NDg3Mzc0MTE5ODA3MzY0NTYyMTAwMzg1NjUwNjY5Nzc2ODI2NDQ1ODU3MjQ5MjgzOTc4NjIiLCI2MDE3NjQzMTE5NzQ2MTE3MDYzNzY5Mjg4Mjk1NTYyNzkxNzQ1NjgwMDY0ODQ1ODc3MjQ3MjMzMTQ1MTkxODkwODU2ODQ1NTAxNjQ0NSIsIjEwNTc0MDQzMDUxNTg2MjQ1NzM2MDYyMzEzNDEyNjE3OTU2MTE1Mzk5MzczODc3NDExNTQwMDg2MTQwMDY0OTIxNTM2MDgwNzE5NzcyNiIsIjc2ODQwNDgzNzY3NTAxODg1ODg0MzY4MDAyOTI1NTE3MTc5MzY1ODE1MDE5MzgzNDY2ODc5Nzc0NTg2MTUxMzE0NDc5MzA5NTg0MjU1Il0sImhhc2hEaXJlY3Rpb24iOlsxLDAsMCwwLDAsMCwwLDAsMCwwXSwidHhIYXNoIjoiMHg3ZWVhNjMzNGM1NjhlZTEzYjlhMzAyZWQ5ZmE4NDk3NGQwNTU2MmI5NTlkYjc0YjFmYTM5NDJlNDBlYTMwZmI0In0=
// eyJyb290IjoiMTU4MzI5NTM0NDYxNTMxMTY0NDM2Njk0MTkzNTQyMDU0NDg2OTk4Mzc0NDU0MTg0NTYxOTg1MzI2MTc3MDg5ODg5NTg0Mjg0OTQ2MjciLCJudWxsaWZpZXJIYXNoIjoiMTA4MDkxNjc0NzUyOTI1NTczNzc4MjM3NzQxMzM3ODYwMzkyMDQ2OTk1MTk4MDkzNTI1NTkyODMyODg1NjM2MjgzNjU1MTQwMTcxNTYiLCJzZWNyZXQiOiIxMTI4NDQ5MzI3OTY2Mzg0NTg5OTUyODA3NzM5OTM1NDczMDM4NDcwOTY5MDczNTgxMzE1OTA2MTE2MTIyOTM3NTc5NDY2NjMzMjM1NDkiLCJudWxsaWZpZXIiOiIzODEyNzA3MzE5NDk4Nzk1NTI5NTk2NTcxNDUxMjYwNTEyMTM0ODUzMTk5Mjg3NzAyOTM2OTMwMTg0Njk5OTEzODgzNTIwODAwNTM5NSIsImNvbW1pdG1lbnQiOiIxMzg1MTYxNzQ3ODMwMzcyMTExMzU0MjYwNDMyOTQwMDI2NjE0OTMxNTQ3NzEwNDY1ODE1MDUzNTczODgzMjQ5NTAyNzIxMjYzNjkxNCIsImhhc2hQYWlyaW5ncyI6WyIyMzE4Mzc3MjIyNjg4MDMyODA5Mzg4NzIxNTQwODk2NjcwNDM5OTQwMTkxODgzMzE4ODIzODEyODcyNTk0NDYxMDQyODE4NTQ2NjM3OSIsIjU4NDY4NjAzODAwNDM4MzgyODkyNzk0MzMwNTQ0ODU1MTcyMzUzOTkzMjcwNjMwNTE3MjIyNjYwNDQwNDczNzE2MzE3NDExNjQ0NTUiLCI5MDc2NzczNTE2MzM4NTIxMzI4MDAyOTIyMTM5NTAwNzk1MjA4Mjc2NzkyMjI0NjI2Nzg1ODIzNzA3MjAxMjA5MDY3MzM5NjE5Njc0MCIsIjM2ODM4NDQ2OTIyOTMzNzAyMjY2MTYxMzk0MDAwMDA2OTU2NzU2MDYxODk5NjczNTc2NDU0NTEzOTkyMDEzODUzMDkzMjc2NTI3ODEzIiwiNjg5NDI0MTkzNTE1MDkxMjY0NDg1NzA3NDAzNzQ3NDcxODE5NjU2OTY3MTQ0NTg3NzUyMTQ5MzkzNDUyMjE4ODUyODIxMTM0MDQ1MDUiLCI1MDA4MjM4NjUxNTA0NTA1MzUwNDA3NjMyNjAzMzQ0MjgwOTU1MTAxMTMxNTU4MDI2NzE3MzU2NDU2MzE5Nzg4OTE2MjQyMzYxOTYyMyIsIjczMTgyNDIxNzU4Mjg2NDY5MzEwODUwODQ4NzM3NDExOTgwNzM2NDU2MjEwMDM4NTY1MDY2OTc3NjgyNjQ0NTg1NzI0OTI4Mzk3ODYyIiwiNjAxNzY0MzExOTc0NjExNzA2Mzc2OTI4ODI5NTU2Mjc5MTc0NTY4MDA2NDg0NTg3NzI0NzIzMzE0NTE5MTg5MDg1Njg0NTUwMTY0NDUiLCIxMDU3NDA0MzA1MTU4NjI0NTczNjA2MjMxMzQxMjYxNzk1NjExNTM5OTM3Mzg3NzQxMTU0MDA4NjE0MDA2NDkyMTUzNjA4MDcxOTc3MjYiLCI3Njg0MDQ4Mzc2NzUwMTg4NTg4NDM2ODAwMjkyNTUxNzE3OTM2NTgxNTAxOTM4MzQ2Njg3OTc3NDU4NjE1MTMxNDQ3OTMwOTU4NDI1NSJdLCJoYXNoRGlyZWN0aW9uIjpbMCwxLDAsMCwwLDAsMCwwLDAsMF0sInR4SGFzaCI6IjB4ODQ5YWJkNmIxZDdmMmYxNWI4ODI2Njk4Y2Y1MjIyOGU1NTQ4ZDA5YWI1NGY1ZmQ1ZWI0ZDczNDQ0NmZkNWM1YSJ9
// eyJyb290IjoiMTI2ODExMjU0MzY1ODk3Njc0MTM0NzE2OTc4MTkzNTA1OTUxMTU5MDIzMzkyNjY1MjgxNTM1MzM3NTYwOTcxNjM5NTUyMDY1ODM0NzkiLCJudWxsaWZpZXJIYXNoIjoiMTU0ODk2MDI5NjI4MDI4OTQ4NzA0NTI2Mzg4MTgyMTAzMDI5Mjk4NDE5NjU4OTM2NTQ3OTc4NjI0OTM3NzI3Nzc1NTY5MDc1NDY3NjAiLCJzZWNyZXQiOiIxMDI4NjM5MzY3Njc3Njk2MTY3OTQwMzkzMDczNzk1NjQ0MzQzODczNDY4ODM4MTg0MTg5MTYwNzQwMjMxMTY4NjMyNzM5NzkxNDg5ODQiLCJudWxsaWZpZXIiOiI1NjE5OTQ3NzQzMjI4NTYyNDY3MDY3NzMyODUzNjIyODc4Mzg3MjAxOTY0MTI4MDgwNjMyOTI2OTQyNjM4Mzc0ODIyNTE2NjEyMDc2MSIsImNvbW1pdG1lbnQiOiIxNzI3NDI3NzY5MTc3OTczNjE5NTAwMjQ2NDQ2OTE5MTQ5NzQ1NTI5Mzk0Mjc5MDc5MDkxMjA3OTI4OTk3NzE3NjQwNTkyMjc2MDA0NCIsImhhc2hQYWlyaW5ncyI6WyIxMzg1MTYxNzQ3ODMwMzcyMTExMzU0MjYwNDMyOTQwMDI2NjE0OTMxNTQ3NzEwNDY1ODE1MDUzNTczODgzMjQ5NTAyNzIxMjYzNjkxNCIsIjExMjkwODY3NTA3NjcyODU0MTQyMzIyODgzODMxMTUyOTkwMDU2NTE4NzgwNDIwMzI4Njk5NDE1Mjc0OTczODgyMDEzMTk3MzkxMzc5IiwiOTA3Njc3MzUxNjMzODUyMTMyODAwMjkyMjEzOTUwMDc5NTIwODI3Njc5MjIyNDYyNjc4NTgyMzcwNzIwMTIwOTA2NzMzOTYxOTY3NDAiLCIzNjgzODQ0NjkyMjkzMzcwMjI2NjE2MTM5NDAwMDAwNjk1Njc1NjA2MTg5OTY3MzU3NjQ1NDUxMzk5MjAxMzg1MzA5MzI3NjUyNzgxMyIsIjY4OTQyNDE5MzUxNTA5MTI2NDQ4NTcwNzQwMzc0NzQ3MTgxOTY1Njk2NzE0NDU4Nzc1MjE0OTM5MzQ1MjIxODg1MjgyMTEzNDA0NTA1IiwiNTAwODIzODY1MTUwNDUwNTM1MDQwNzYzMjYwMzM0NDI4MDk1NTEwMTEzMTU1ODAyNjcxNzM1NjQ1NjMxOTc4ODkxNjI0MjM2MTk2MjMiLCI3MzE4MjQyMTc1ODI4NjQ2OTMxMDg1MDg0ODczNzQxMTk4MDczNjQ1NjIxMDAzODU2NTA2Njk3NzY4MjY0NDU4NTcyNDkyODM5Nzg2MiIsIjYwMTc2NDMxMTk3NDYxMTcwNjM3NjkyODgyOTU1NjI3OTE3NDU2ODAwNjQ4NDU4NzcyNDcyMzMxNDUxOTE4OTA4NTY4NDU1MDE2NDQ1IiwiMTA1NzQwNDMwNTE1ODYyNDU3MzYwNjIzMTM0MTI2MTc5NTYxMTUzOTkzNzM4Nzc0MTE1NDAwODYxNDAwNjQ5MjE1MzYwODA3MTk3NzI2IiwiNzY4NDA0ODM3Njc1MDE4ODU4ODQzNjgwMDI5MjU1MTcxNzkzNjU4MTUwMTkzODM0NjY4Nzk3NzQ1ODYxNTEzMTQ0NzkzMDk1ODQyNTUiXSwiaGFzaERpcmVjdGlvbiI6WzEsMSwwLDAsMCwwLDAsMCwwLDBdLCJ0eEhhc2giOiIweDQ1NGQ5MzBjNTNjODJiNTdmZGE3Y2EyZWY0NDg5NzhkYjdjNTQwZjYyZTJiYjBlYmY1YjViZDUyODNmMDA5NmEifQ==
// eyJyb290IjoiNTQ0MzI0MzgwNzk5MDY2MjU1Mzc4NTQxNDIzNjA1NzMyMDg3ODk3ODkxODcyMzMxMjcyNDU0NzE3MjY5Mjk4MzkwMDI0MjQ2NzU5NyIsIm51bGxpZmllckhhc2giOiIxNDg3NDUwMDIzODY2MDA5MDkxMTI0NzExMzYzOTc2MDQ1MDYzMzYzNDM3NzgyMzY5MDc1OTg1Nzg4MDQyMjE0ODU1Mzc1MTU2MTAyOSIsInNlY3JldCI6IjgzMTYzNjU2NzgyMzk1MDgzNzIzODM3MjQ3NDA1NjE4ODA0ODExNjIwOTU3NTk1Mjc4NTg0MjU0OTg3NTE4NjQzMDcyMzAzMjg3MTM0IiwibnVsbGlmaWVyIjoiMTE0MjAzMTIzMzU1MDEwMjk2MjU0NTE0MjUxNTIxMzQ5ODYyNzE4MzE1NzQzMDI0ODkyMjA4NDQ0MjM1MzEyNTA3OTAwNDg3OTgzNzE0IiwiY29tbWl0bWVudCI6IjgzODYzMTcxMDYxNTUxNDAzMzY5OTMxOTAzMjI0Nzg2MzA5NDYwMzg3NTk0ODA4MTg3NTQ3NDI2NDEwNzM2NTE4ODA4OTI4MjI3NjYiLCJoYXNoUGFpcmluZ3MiOlsiNTk3MTY4NTY4NTYwNjM4NzUxOTg0NjAxODMxODMzOTIzOTgwNTY4NzUyNjA2MDMyNjE0MDgzNjU2NTcyMTIwMzkzNjU3NjY1ODIxNSIsIjI0MDAwODE5MzY5NjAyMDkzODE0NDE2MTM5NTA4NjE0ODUyNDkxOTA4Mzk1NTc5NDM1NDY2OTMyODU5MDU2ODA0MDM3ODA2NDU0OTczIiwiMTM5MjUzMzczMjc1NzE3MTYzNDc0MTc0ODc2OTgxMTUzOTc5MjgzNzUzMjM2MjI1NTMyNzgyMTgwNDk0Mjg0OTE0NTIzODA0OTMyMDAiLCIzNjgzODQ0NjkyMjkzMzcwMjI2NjE2MTM5NDAwMDAwNjk1Njc1NjA2MTg5OTY3MzU3NjQ1NDUxMzk5MjAxMzg1MzA5MzI3NjUyNzgxMyIsIjY4OTQyNDE5MzUxNTA5MTI2NDQ4NTcwNzQwMzc0NzQ3MTgxOTY1Njk2NzE0NDU4Nzc1MjE0OTM5MzQ1MjIxODg1MjgyMTEzNDA0NTA1IiwiNTAwODIzODY1MTUwNDUwNTM1MDQwNzYzMjYwMzM0NDI4MDk1NTEwMTEzMTU1ODAyNjcxNzM1NjQ1NjMxOTc4ODkxNjI0MjM2MTk2MjMiLCI3MzE4MjQyMTc1ODI4NjQ2OTMxMDg1MDg0ODczNzQxMTk4MDczNjQ1NjIxMDAzODU2NTA2Njk3NzY4MjY0NDU4NTcyNDkyODM5Nzg2MiIsIjYwMTc2NDMxMTk3NDYxMTcwNjM3NjkyODgyOTU1NjI3OTE3NDU2ODAwNjQ4NDU4NzcyNDcyMzMxNDUxOTE4OTA4NTY4NDU1MDE2NDQ1IiwiMTA1NzQwNDMwNTE1ODYyNDU3MzYwNjIzMTM0MTI2MTc5NTYxMTUzOTkzNzM4Nzc0MTE1NDAwODYxNDAwNjQ5MjE1MzYwODA3MTk3NzI2IiwiNzY4NDA0ODM3Njc1MDE4ODU4ODQzNjgwMDI5MjU1MTcxNzkzNjU4MTUwMTkzODM0NjY4Nzk3NzQ1ODYxNTEzMTQ0NzkzMDk1ODQyNTUiXSwiaGFzaERpcmVjdGlvbiI6WzEsMCwxLDAsMCwwLDAsMCwwLDBdLCJ0eEhhc2giOiIweDZjNjRiNGM0YmE2NGY1MmRlM2ZjZjY3ODQzNGUzY2E2M2ExOTMzZjJhOWJjYWVkMjllNGMwYTNjYmJhNzhkYmUifQ==
// eyJyb290IjoiMTc1OTA5NzMxNjA0NDkxMjE2MDU0NTgzOTYzNjM1ODU3NTkzMzcyOTE5MTIyMjY3MTk5NzEwNTEwODkyMTU5MTQ5NTM1MTMzNDA2MDkiLCJudWxsaWZpZXJIYXNoIjoiMTI3ODA1NzMzNDU4MzM3ODkxMDgxNzkwMzEyNzQ2Nzk0MTgzNzMzOTQxMzM0MDA0MjU5NDUxNzg1ODgyMDk4MjI0NTczMTA1NzY0OSIsInNlY3JldCI6IjExMjkwMzkyNzIzMTM4MjAxMTQ0NTI0MDUyMjI4NDEyNTc0OTM0NjY0NDIzNDQ0NjM4NzYxNzU3NDA1MDgzNzgyODQ3NjY0NzkxODcyOCIsIm51bGxpZmllciI6Ijc0NTkzODkxNTM3MDEyMzUxOTE4NTc4MjM4MzcwNjk5MTAzMjQ2ODU0NTgwMjQ1MTQ5MDA5NDk3ODcwODgyMjg3NDA5Mjg0MzI2Mzk1IiwiY29tbWl0bWVudCI6IjEyNTgyMjExMzY3MDM4NTI5OTM3ODMzODM1NDY5MjE5OTc3NTU0NjMxNDc5NTczMDMzNDI0OTgwNzUzOTEwNTIwOTEzMzI0Nzg2MjkwIiwiaGFzaFBhaXJpbmdzIjpbIjIzMTgzNzcyMjI2ODgwMzI4MDkzODg3MjE1NDA4OTY2NzA0Mzk5NDAxOTE4ODMzMTg4MjM4MTI4NzI1OTQ0NjEwNDI4MTg1NDY2Mzc5IiwiNDQ4NTAxMjk3MzQ4OTk3ODcwNTc3ODkwMDg3NDU4NDExMzA0MjM2NjkyNTkyOTQ3Nzk2ODExODkxMDkyNDAwMjI2MTc0NzI4MjM4OSIsIjI4Mjg5MzAwMjQ4NjE1NjUxMzczMjczNDQ1MDM1NTkwMjMwMDI2Njk5NjE2MzA4ODA1MzYyMjU4ODQ1NzQ3MjQwNjIxNzU5ODQ5MjkiLCIzNjgzODQ0NjkyMjkzMzcwMjI2NjE2MTM5NDAwMDAwNjk1Njc1NjA2MTg5OTY3MzU3NjQ1NDUxMzk5MjAxMzg1MzA5MzI3NjUyNzgxMyIsIjY4OTQyNDE5MzUxNTA5MTI2NDQ4NTcwNzQwMzc0NzQ3MTgxOTY1Njk2NzE0NDU4Nzc1MjE0OTM5MzQ1MjIxODg1MjgyMTEzNDA0NTA1IiwiNTAwODIzODY1MTUwNDUwNTM1MDQwNzYzMjYwMzM0NDI4MDk1NTEwMTEzMTU1ODAyNjcxNzM1NjQ1NjMxOTc4ODkxNjI0MjM2MTk2MjMiLCI3MzE4MjQyMTc1ODI4NjQ2OTMxMDg1MDg0ODczNzQxMTk4MDczNjQ1NjIxMDAzODU2NTA2Njk3NzY4MjY0NDU4NTcyNDkyODM5Nzg2MiIsIjYwMTc2NDMxMTk3NDYxMTcwNjM3NjkyODgyOTU1NjI3OTE3NDU2ODAwNjQ4NDU4NzcyNDcyMzMxNDUxOTE4OTA4NTY4NDU1MDE2NDQ1IiwiMTA1NzQwNDMwNTE1ODYyNDU3MzYwNjIzMTM0MTI2MTc5NTYxMTUzOTkzNzM4Nzc0MTE1NDAwODYxNDAwNjQ5MjE1MzYwODA3MTk3NzI2IiwiNzY4NDA0ODM3Njc1MDE4ODU4ODQzNjgwMDI5MjU1MTcxNzkzNjU4MTUwMTkzODM0NjY4Nzk3NzQ1ODYxNTEzMTQ0NzkzMDk1ODQyNTUiXSwiaGFzaERpcmVjdGlvbiI6WzAsMSwxLDAsMCwwLDAsMCwwLDBdLCJ0eEhhc2giOiIweGI0NGU1ZGZmYjk3Mzk2MjBmN2M5N2Q3ZTZiOGQ1NjM2YmI4YzIwYWU1ODE2NzIzYzc0MjE1ZGNjZTQ5M2EwMzgifQ==

// eyJyb290IjoiODIzOTI5NjY5NjA3MjE2NTk5MzYyNTM2MjkyMjM0OTAyMzUzNjk2Nzk1Mjc1MjQ1OTA0NDM4MTczOTc5MTE1ODkxNzE4MDM3MDYzMyIsIm51bGxpZmllckhhc2giOiIyMjQ4MzA5OTQ1NjY2MzIyOTQ1NDA5Mzk2NTQzNjk4ODc5MDY0MTE4MjkxNjA2NjQ2NTEzNTY2ODE2MDA3NTIzNTgzOTQzNDE0MzAwIiwicmVjaXBpZW50IjoiMTAwNjY2OTc2MDk0NTQ3MTI0NjY0NTAzOTAyMzcwMjkzOTk0MDQwNzgyMDkyODc3NSIsInNlY3JldCI6WyIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIl0sIm51bGxpZmllciI6WyIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIl0sImhhc2hQYWlyaW5ncyI6WyIyMzE4Mzc3MjIyNjg4MDMyODA5Mzg4NzIxNTQwODk2NjcwNDM5OTQwMTkxODgzMzE4ODIzODEyODcyNTk0NDYxMDQyODE4NTQ2NjM3OSIsIjI0MDAwODE5MzY5NjAyMDkzODE0NDE2MTM5NTA4NjE0ODUyNDkxOTA4Mzk1NTc5NDM1NDY2OTMyODU5MDU2ODA0MDM3ODA2NDU0OTczIiwiOTA3Njc3MzUxNjMzODUyMTMyODAwMjkyMjEzOTUwMDc5NTIwODI3Njc5MjIyNDYyNjc4NTgyMzcwNzIwMTIwOTA2NzMzOTYxOTY3NDAiLCIzNTk5NDA0NDMyMDE5MTk4NTY2NDA1MTQ3ODkxODgyMTU4NjM0OTIyOTEzNTIzMzU3NzA3MzQxNTU2MTkyODMwNTg1MTM5NjkzODQ0IiwiNjg5NDI0MTkzNTE1MDkxMjY0NDg1NzA3NDAzNzQ3NDcxODE5NjU2OTY3MTQ0NTg3NzUyMTQ5MzkzNDUyMjE4ODUyODIxMTM0MDQ1MDUiLCI1MDA4MjM4NjUxNTA0NTA1MzUwNDA3NjMyNjAzMzQ0MjgwOTU1MTAxMTMxNTU4MDI2NzE3MzU2NDU2MzE5Nzg4OTE2MjQyMzYxOTYyMyIsIjczMTgyNDIxNzU4Mjg2NDY5MzEwODUwODQ4NzM3NDExOTgwNzM2NDU2MjEwMDM4NTY1MDY2OTc3NjgyNjQ0NTg1NzI0OTI4Mzk3ODYyIiwiNjAxNzY0MzExOTc0NjExNzA2Mzc2OTI4ODI5NTU2Mjc5MTc0NTY4MDA2NDg0NTg3NzI0NzIzMzE0NTE5MTg5MDg1Njg0NTUwMTY0NDUiLCIxMDU3NDA0MzA1MTU4NjI0NTczNjA2MjMxMzQxMjYxNzk1NjExNTM5OTM3Mzg3NzQxMTU0MDA4NjE0MDA2NDkyMTUzNjA4MDcxOTc3MjYiLCI3Njg0MDQ4Mzc2NzUwMTg4NTg4NDM2ODAwMjkyNTUxNzE3OTM2NTgxNTAxOTM4MzQ2Njg3OTc3NDU4NjE1MTMxNDQ3OTMwOTU4NDI1NSJdLCJoYXNoRGlyZWN0aW9ucyI6WzAsMCwwLDEsMCwwLDAsMCwwLDBdfQ==
// eyJyb290IjoiMTAwNzgxMDk3MzUzMTMxMDc2MDE0MjIyMzk5NDM2ODE5OTI1ODEyNjkwNjI3ODk2MTY5OTM3NjQ4MzA0OTQ3NjAwNDU3MjE2NjI2NjUiLCJudWxsaWZpZXJIYXNoIjoiMjA5MjIwNDM0NzE3NzI4OTA4ODcyMTE2Mzc3Njc3ODAyNzM5NDAzMjU3NzgwMDk4OTM0MDkxMTYwNTMwMDQwODY4NjgxMDQzNTMxMzUiLCJyZWNpcGllbnQiOiIxMDA2NjY5NzYwOTQ1NDcxMjQ2NjQ1MDM5MDIzNzAyOTM5OTQwNDA3ODIwOTI4Nzc1Iiwic2VjcmV0IjpbIjAiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiXSwibnVsbGlmaWVyIjpbIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjAiLCIxIiwiMCIsIjEiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMSIsIjEiLCIxIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIxIiwiMCIsIjAiLCIwIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMSIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiLCIxIiwiMSIsIjEiLCIwIiwiMCIsIjEiLCIwIiwiMCIsIjEiLCIxIiwiMCIsIjEiLCIxIiwiMCIsIjAiLCIxIiwiMCIsIjAiLCIxIiwiMSIsIjAiLCIwIiwiMSIsIjAiXSwiaGFzaFBhaXJpbmdzIjpbIjIwMTgzOTA3NDI4MzY2NjI0Nzc0MTAzMDkzNzU4ODcyMTAwNzM2OTM2ODIyMzEzODMwMTU4MDgxODkyMjUxMTk0MjEyNjA0MzExODAzIiwiMjQwMDA4MTkzNjk2MDIwOTM4MTQ0MTYxMzk1MDg2MTQ4NTI0OTE5MDgzOTU1Nzk0MzU0NjY5MzI4NTkwNTY4MDQwMzc4MDY0NTQ5NzMiLCI5MDc2NzczNTE2MzM4NTIxMzI4MDAyOTIyMTM5NTAwNzk1MjA4Mjc2NzkyMjI0NjI2Nzg1ODIzNzA3MjAxMjA5MDY3MzM5NjE5Njc0MCIsIjEzMDU2NjY2MjU4NTcxMjk3NzE0MDM3ODMzNzk5MjE5NjEyMDkzMjQ1MTczOTM5MDM1NTAwMDYxMzMxNDM5MzQxMjUzNTE3NzE3NzYiLCI2ODk0MjQxOTM1MTUwOTEyNjQ0ODU3MDc0MDM3NDc0NzE4MTk2NTY5NjcxNDQ1ODc3NTIxNDkzOTM0NTIyMTg4NTI4MjExMzQwNDUwNSIsIjUwMDgyMzg2NTE1MDQ1MDUzNTA0MDc2MzI2MDMzNDQyODA5NTUxMDExMzE1NTgwMjY3MTczNTY0NTYzMTk3ODg5MTYyNDIzNjE5NjIzIiwiNzMxODI0MjE3NTgyODY0NjkzMTA4NTA4NDg3Mzc0MTE5ODA3MzY0NTYyMTAwMzg1NjUwNjY5Nzc2ODI2NDQ1ODU3MjQ5MjgzOTc4NjIiLCI2MDE3NjQzMTE5NzQ2MTE3MDYzNzY5Mjg4Mjk1NTYyNzkxNzQ1NjgwMDY0ODQ1ODc3MjQ3MjMzMTQ1MTkxODkwODU2ODQ1NTAxNjQ0NSIsIjEwNTc0MDQzMDUxNTg2MjQ1NzM2MDYyMzEzNDEyNjE3OTU2MTE1Mzk5MzczODc3NDExNTQwMDg2MTQwMDY0OTIxNTM2MDgwNzE5NzcyNiIsIjc2ODQwNDgzNzY3NTAxODg1ODg0MzY4MDAyOTI1NTE3MTc5MzY1ODE1MDE5MzgzNDY2ODc5Nzc0NTg2MTUxMzE0NDc5MzA5NTg0MjU1Il0sImhhc2hEaXJlY3Rpb25zIjpbMSwwLDAsMSwwLDAsMCwwLDAsMF19

const UZAR_TOKEN_ADDRESS = "0xBf715EB900bbEAa2C7e136E9c2A0C6AED93E8aeb"; // lisk sepolia // '0x5315E2c1B45f58c468dE6a31eBF8ae9f06790F32'; sepolia eth 11155111
const CONTRACT_ADDRESS = "0x46c321234896293Fae383C9768b338902db6B20E"; // lisk sepolia // "0x2836692157Dd96cb74870a12210273983144Cf3C"; sepolia eth
const tornadoAddress = "0x46c321234896293Fae383C9768b338902db6B20E"; // lisk sepolia  // "0x2836692157Dd96cb74870a12210273983144Cf3C"; sepolia  eth
const tornadoABI = tornadoJSON.abi;
const tornadoInterface = new ethers.utils.Interface(tornadoABI);
const ButtonState = { Normal: 0, Loading: 1, Disabled: 2 };
const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccount] = useState(null);
  const [uzarBalance, setUzarBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [uzarToken, setUzarToken] = useState(null);
  const [contract, setContract] = useState(null);



  const [account, updateAccount] = useState(null);
  const [proofElements, updateProofElements] = useState(null);
  const [proofStringEl, updateProofStringEl] = useState(null);
  const [textArea, updateTextArea] = useState(null);

  // interface states
  const [section, updateSection] = useState("Deposit");
  const [displayCopiedMessage, updateDisplayCopiedMessage] = useState(false);
  const [withdrawalSuccessful, updateWithdrawalSuccessful] = useState(false);
  const [metamaskButtonState, updateMetamaskButtonState] = useState(ButtonState.Normal);
  const [depositButtonState, updateDepositButtonState] = useState(ButtonState.Normal);
  const [withdrawButtonState, updateWithdrawButtonState] = useState(ButtonState.Normal);

  const [qrCodeURL, setQRCodeURL] = useState("");
  const [isScanned, setIsScanned] = useState(false); 



  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = _provider.getSigner();
          const userAccount = await signer.getAddress();
          setAccount(userAccount);

          const _contract = new ethers.Contract(CONTRACT_ADDRESS, tornadoABI, signer);
          setContract(_contract);

          const _uzarToken = new ethers.Contract(UZAR_TOKEN_ADDRESS, UzarTokenABI, signer);
          setUzarToken(_uzarToken);

          fetchBalance(_uzarToken, _contract, userAccount);
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask to use this app");
      }
    };

    init();
  }, []);

  const fetchBalance = async (uzarToken, contract, userAccount) => {
    try {
      const balance = await uzarToken.balanceOf(userAccount);
      setUzarBalance(ethers.utils.formatEther(balance));

      const _allowance = await uzarToken.allowance(userAccount, CONTRACT_ADDRESS);
      setAllowance(ethers.utils.formatEther(_allowance));
    } catch (err) {
      console.error("Error fetching UZAR balance or allowance:", err);
    }
  };

  const approveUzar = async () => {
    try {
      const amountToApprove = ethers.utils.parseEther("1000000"); 
      const tx = await uzarToken.approve(CONTRACT_ADDRESS, amountToApprove);
      await tx.wait(); 
      alert("UZAR approved successfully");
      fetchBalance(uzarToken, contract, account); 
    } catch (err) {
      console.error("Error approving UZAR:", err);
    }
  };
  


  const connectMetamask = async () => {
    try{
        updateMetamaskButtonState(ButtonState.Disabled);
        if(!window.ethereum){
            alert("Please install Metamask to use this app.");
            throw "no-metamask";
        }

        var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        var chainId = window.ethereum.networkVersion;

        // if(chainId != "11155111"){
        //     alert("Please switch to Sepolia Testnet");
        //     throw "wrong-chain";
        // }

        var activeAccount = accounts[0];
        var balance = await window.ethereum.request({ method: "eth_getBalance", params: [activeAccount, "latest"] });
        balance = $u.moveDecimalLeft(ethers.BigNumber.from(balance).toString(), 18);

        var newAccountState = {
            chainId: chainId,
            address: activeAccount,
            balance: balance
        };
        updateAccount(newAccountState);
    }catch(e){
        console.log(e);
    }

    updateMetamaskButtonState(ButtonState.Normal);
  };

  const depositEther = async (amount) => {
    updateDepositButtonState(ButtonState.Disabled);
    try {
      const secret = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
      const nullifier = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
  
      const input = {
        secret: $u.BN256ToBin(secret).split(""),
        nullifier: $u.BN256ToBin(nullifier).split("")
      };
      console.log("Proof Input:", input);
  
      // Load circuit
      const res = await fetch("/deposit.wasm");
      const buffer = await res.arrayBuffer();
      const depositWC = await wc(buffer);
  
      // Calculate witness
      const r = await depositWC.calculateWitness(input, 0);
      const commitment = r[1];
      const nullifierHash = r[2];
      const { instance } = await loadWasm();
    
      // Prepare the transaction
      const tx = {
        to: tornadoAddress,
        from: account.address,
        data: tornadoInterface.encodeFunctionData("deposit", [commitment]),
        maxFeePerGas: "10000000",
      };
  
      // Send the transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      console.log("Transaction sent. Hash:", txHash);
  
      // Wait for receipt
      let receipt = null;
      while (!receipt) {
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });

        if (!receipt) {
          console.log("Waiting for the transaction receipt...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
  
      console.log("Transaction receipt received:", receipt);
  
      if (!receipt.logs || receipt.logs.length === 0) {
        throw new Error("No logs found in the transaction receipt.");
      }
  
      const log = receipt.logs[2];
      const decodeData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);
      console.log("Decoded Event Data:", JSON.stringify(decodeData));

  
      const proofElements = {
        root: $u.BNToDecimal(decodeData.root),
        nullifierHash: `${nullifierHash}`,
        secret: secret,
        nullifier: nullifier,
        commitment: `${commitment}`,
        hashPairings: decodeData.hashPairings.map((n) => $u.BNToDecimal(n)),
        hashDirection: decodeData.pairDirection,
        txHash: txHash,
      };
  
      console.log("Proof Elements:", proofElements);
      const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);
      const SnarkJS = window['snarkjs'];

      const proofInput = {
        "root": $u.BNToDecimal(decodedData.root),
        "nullifierHash": proofElements.nullifierHash,
        "recipient": $u.BNToDecimal(account.address),
        "secret": $u.BN256ToBin(proofElements.secret).split(""),
        "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
        "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
        "hashDirections": decodedData.pairDirection
      };

      console.log("final proof",proofInput)

      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

      const callInputs = [
        proof.pi_a.slice(0, 2).map($u.BN256ToHex),
        proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
        proof.pi_c.slice(0, 2).map($u.BN256ToHex),
        publicSignals.slice(0, 2).map($u.BN256ToHex)
      ];

      // Update the proof elements
      updateProofElements(btoa(JSON.stringify(proofInput)));
      console.log("Proof inputs:", callInputs)

      try {
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, (JSON.stringify(proofInput)), {
          // await QRCode.toCanvas(canvas, btoa(JSON.stringify(proofElements)), {
          errorCorrectionLevel: "L",
          width: 300, 
        });

        const ctx = canvas.getContext("2d");

        const text = "20";
        ctx.font = "bold 40px Arial"; 
        ctx.fillStyle = "green"; 
        const textWidth = ctx.measureText(text).width;

        ctx.fillText(
          text,
          (canvas.width - textWidth) / 2,
          canvas.height / 2 + 10 
        );

        
        const qrCodeWithAmountURL = canvas.toDataURL();
        setQRCodeURL(qrCodeWithAmountURL);
      } catch (error) {
        console.error("Error generating QR Code with amount:", error);
      }
  
      // // Prepare QR/NFC payload
      // const qrPayload = {
      //   proof: proofElements,
      //   amount,
      // };
      // console.log("QR/NFC Payload:", qrPayload);
  
      // // Generate QR Code or NFC (use a library like qrcode for QR code generation)
      // // Example: QRCode.toDataURL(JSON.stringify(qrPayload)) for a QR code
      // QRCode.toDataURL(JSON.stringify(qrPayload))

      

      
    } catch (e) {
      console.error("Error in depositEther:", e);
    } finally {
      updateDepositButtonState(ButtonState.Normal);
    }
  };
  


  const copyProof = () => {
      if(!!proofStringEl){
          flashCopiedMessage();
          navigator.clipboard.writeText(proofStringEl.innerHTML);
      }  
  };

  const withdraw = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if(!textArea || !textArea.value){ alert("Please input the proof of deposit string."); }

    try{
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:",proofElements);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if(!receipt){ throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof",proofInput)

        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        const callData = tornadoInterface.encodeFunctionData("withdraw", callInputs);
        const tx = {
            to: tornadoAddress,
            from: account.address,
            data: callData
        };
        const txHash = await window.ethereum.request({ method: "eth_sendTransaction", params: [tx] });

        var receipt;
        while(!receipt){
            receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
            await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
        }

        if(!!receipt){ updateWithdrawalSuccessful(true); }
    }catch(e){
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
  };



  const tester1 = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if(!textArea || !textArea.value){ alert("Please input the proof of deposit string."); }

    try {
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:", proofElements);

        console.log("Root:", proofElements.root);
        console.log("Hash:", proofElements.nullifierHash);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if(!receipt){ throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof", proofInput);
        console.log("Nullifier Hash:", proofInput.nullifierHash);

        // Save proofInput to a JSON file
        const jsonBlob = new Blob([JSON.stringify(proofInput, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = jsonUrl;
        downloadLink.download = 'proofInput.json'; 
        downloadLink.click();
        
        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        console.log("Proof data:", callInputs);

        var receipt;
        while(!receipt){
            receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
            await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
        }

        if(!!receipt){ updateWithdrawalSuccessful(true); }

    } catch (e) {
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
  };

  const tester = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if (!textArea || !textArea.value) { alert("Please input the proof of deposit string."); }

    try {
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:", proofElements);

        console.log("Root:", proofElements.root);
        console.log("Hash:", proofElements.nullifierHash);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if (!receipt) { throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof", proofInput);
        console.log("Nullifier Hash:", proofInput.nullifierHash);

        // Generate the proof and public signals
        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        console.log("Public Signals:", publicSignals);

        // Prepare the inputs for the verification
        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        console.log("Proof data:", callInputs);

        console.log("Public Signals:", publicSignals);
        console.log("Proof:", proof);

        const vKeyResponse = await fetch("/verification_key.json");
        const vKey = await vKeyResponse.json();



        // Verify the proof with the public signals
        const isValid = await SnarkJS.groth16.verify(vKey, publicSignals, proof);
        if (isValid) {
            console.log("Proof is valid.");
            // Continue with your logic if the proof is valid
            var receipt;
            while (!receipt) {
                receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
                await new Promise((resolve) => { setTimeout(resolve, 1000); });
            }

            if (!!receipt) { updateWithdrawalSuccessful(true); }
        } else {
            console.log("Invalid proof.");
            // Handle invalid proof case here
        }

    } catch (e) {
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
};



  const flashCopiedMessage = async () => {
      updateDisplayCopiedMessage(true);
      setTimeout(() => {
          updateDisplayCopiedMessage(false);
      }, 1000);
  }


  // useEffect(() => {
  //   const generateQRCodeWithAmount = async () => {
  //     const proofData = {
  //       proof: {
  //         root: "12345",
  //         nullifierHash: "67890",
  //         commitment: "abcdef",
  //         txHash: "0x1234567890abcdef",
  //       },
  //       amount: "50 UZAR",
  //     };

      
  //   };

  //   generateQRCodeWithAmount();
  // }, []);

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeURL;
    link.download = "zkp_ocx.png";
    link.click();
  };

  const handleScan = () => {
    setIsScanned(true); // Set scan state to true
  };


  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Money <br /> even when offline
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the offconnectx world. Buy and sell currencies easily on OffConnectX.
          </p>
          
          


          {!!account ? (
            <div className="container">
          
              <div className="text-white text-base font-semibold">
                  <span><strong>{account.address.slice(0, 12) + "..."}</strong></span>
                  <br/>
                  <span className="small">{account.balance.slice(0, 10) + ((account.balance.length > 10) ? ("...") : (""))} ETH</span>
                  <br/>
                  <p className="sm:text-2xl text-white text-gradient py-1">UZAR Balance: {uzarBalance}</p>
                  <p className="text-white text-gradient">Allowance: {allowance}</p>
                  <button  className=" text-white text-gradient" onClick={approveUzar}>Approve UZAR</button>
              </div>
            </div>
            ) : (
              <button
                type="button"
                onClick={connectMetamask}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold">
                  Connect Wallet
                </p>
              </button>
              )
            }
            
          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Offline
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Privacy
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Zero Knowledge
            </div>
          </div>

          <h1 className="text-white font-light text-sm">Your QR Code</h1>
            {!isScanned ? (
              <div>
                <img
                  src={qrCodeURL}
                  alt="Generated QR Code with Amount"
                  onClick={handleScan} // Simulate scan event on click
                  style={{ cursor: "pointer" }}
                />
                <p className="text-white font-light text-sm">Click on the QR Code to simulate scanning.</p>
              </div>
            ) : (
              <div>
                <h1 style={{ color: "red", fontSize: "5rem" }}>X</h1>
                <p className="text-white font-light text-sm">QR Code has been scanned.</p>
              </div>
            )}


        
            {qrCodeURL && (
              <div>
                <img src={qrCodeURL} alt="Custom QR Code" />
                <br />
                <button className="text-white font-light text-sm" onClick={downloadQRCode}>Download QR Code</button>
              </div>
            )}
            {isScanned && <p className="text-white font-light text-sm">QR Code has been scanned!</p>}
            {!qrCodeURL && <p className="text-white font-light text-sm">Loading QR Code...</p>}
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                {!!account ? (
                  <div className="container">
                    <div className="text-white text-base font-semibold">
                        <span><strong>{account.address.slice(0, 12) + "..."}</strong></span>
                        <br/>
                        <span className="small">{account.balance.slice(0, 10) + ((account.balance.length > 4) ? ("...") : (""))} ETH</span>
                    </div>
                  </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectMetamask}
                      className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                    >
                      
                    </button>
                    )
                  }
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                {uzarBalance} UZAR
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            

            <div className="h-[1px] w-full bg-gray-400 my-2" />
                <div className="btn-group" style={{ marginBottom: 20 }}>
                      {
                          (section == "Deposit") ? (
                              <button className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button>
                          ) : (
                              <button onClick={() => { updateSection("Deposit"); }} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button>   
                          )
                      }
                      {
                          (section == "Deposit") ? (
                              <button onClick={() => { updateSection("Withdraw"); }} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button> 
                          ) : (
                              <button className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button>
                          )
                      }
                  </div>
              

              {
                (section == "Deposit" && !!account) && (
                  <div>
                    {
                      (!!proofElements) ? (
                        <div>
                          <div className="alert alert-success text-white">
                            <span><strong>Proof of Deposit:</strong></span>
                            <div className="p-1" style={{ lineHeight: "12px" }}>
                              <span style={{ fontSize: 10 }} ref={(proofStringEl) => { updateProofStringEl(proofStringEl); }}>{proofElements}</span>
                            </div>
                          </div>

                          <div>
                            <button className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" onClick={copyProof}><span className="small">Copy Proof String</span></button>
                            {
                              (!!displayCopiedMessage) && (
                                <span className="small" style={{ color: 'green' }}><strong> Copied!</strong></span>
                              )
                            }
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">Note: All deposits and withdrawals are of the same denomination of 0.1 UZAR.</p>
                          <button 
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                            onClick={depositEther}
                            disabled={depositButtonState == ButtonState.Disabled}
                          ><span className="small">Deposit UZAR</span></button>
                        </div>
                      )
                    }
                  </div>
                )
              }

              {
                (section != "Deposit" && !!account) && (
                  <div>
                    {
                      (withdrawalSuccessful) ? (
                      <div>
                        <div className="alert alert-success p-3">
                            <div><span><strong>Success!</strong></span></div>
                            <div style={{ marginTop: 5 }}>
                              <span className="text-secondary text-white">Withdrawal successful.</span>
                            </div>

                        </div>
                      </div>
                      ) : (
                      <div>
                        <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">Note: All deposits and withdrawals are of the same denomination of UZAR.</p>
                        <div className="form-group">
                          <textarea className="form-control" style={{ resize: "none" }} ref={(ta) => { updateTextArea(ta); }}></textarea>
                        </div>
                        <button 
                          className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                          onClick={withdraw}
                          disabled={withdrawButtonState == ButtonState.Disabled}
                        ><span className="small">Withdraw UZAR</span></button>
                        </div>                  
                      )
                    }
                  </div>
                )
              }







{
                (section != "Deposit" && !!account) && (
                  <div>
                    {
                      (withdrawalSuccessful) ? (
                      <div>
                        <div className="alert alert-success p-3">
                            <div><span><strong>Success!</strong></span></div>
                            <div style={{ marginTop: 5 }}>
                              <span className="text-secondary text-white">Withdrawal successful.</span>
                            </div>

                        </div>
                      </div>
                      ) : (
                      <div>
                        <div className="form-group">
                          <textarea className="form-control" style={{ resize: "none" }} ref={(ta) => { updateTextArea(ta); }}></textarea>
                        </div>
                        <button 
                          className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                          onClick={tester}
                         
                        ><span className="small">Test UZAR Proof</span></button>
                        </div>                  
                      )
                    }
                  </div>
                )
              }

                        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
