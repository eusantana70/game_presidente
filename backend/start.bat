@echo off
title Servidor - Presidente do Brasil
echo ============================================
echo  Iniciando Servidor do Jogo...
echo ============================================
echo.
echo Acesse no navegador: http://localhost:3001
echo.
echo Mantenha esta janela aberta enquanto joga!
echo Para fechar o servidor, clique no X ou pressione Ctrl+C
echo ============================================
echo.

cd /d "%~dp0"
npm start

pause
