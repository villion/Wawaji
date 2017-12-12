
// WawajiRunnerDlg.cpp : 实现文件
//

#include "stdafx.h"
#include "WawajiRunner.h"
#include "WawajiRunnerDlg.h"
#include "afxdialogex.h"
#include "../WawajiDemo/commonFun.h"
#include "../WawajiDemo/FileIO.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// 用于应用程序“关于”菜单项的 CAboutDlg 对话框
#define TIMER_IDEVENT_START 1
#define TIMER_IDEVENT_RECHECK 2
#define TIMER_INTERVAL_START 1000
#define TIMER_INTERVAL_RECHECK 5000
CConfigWawaji gWawajiConfig;


class CAboutDlg : public CDialogEx
{
public:
	CAboutDlg();

// 对话框数据
	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

// 实现
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialogEx(CAboutDlg::IDD)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialogEx)
END_MESSAGE_MAP()


// CWawajiRunnerDlg 对话框



CWawajiRunnerDlg::CWawajiRunnerDlg(CWnd* pParent /*=NULL*/)
	: CDialogEx(CWawajiRunnerDlg::IDD, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CWawajiRunnerDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CWawajiRunnerDlg, CDialogEx)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_TIMER()
	ON_WM_QUERYDRAGICON()
END_MESSAGE_MAP()


// CWawajiRunnerDlg 消息处理程序

BOOL CWawajiRunnerDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	// 将“关于...”菜单项添加到系统菜单中。

	// IDM_ABOUTBOX 必须在系统命令范围内。
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		BOOL bNameValid;
		CString strAboutMenu;
		bNameValid = strAboutMenu.LoadString(IDS_ABOUTBOX);
		ASSERT(bNameValid);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	// 设置此对话框的图标。  当应用程序主窗口不是对话框时，框架将自动
	//  执行此操作
	SetIcon(m_hIcon, TRUE);			// 设置大图标
	SetIcon(m_hIcon, FALSE);		// 设置小图标

	// TODO:  在此添加额外的初始化代码
	initExe();
	SetTimer(TIMER_IDEVENT_RECHECK, TIMER_INTERVAL_RECHECK, nullptr);

	return TRUE;  // 除非将焦点设置到控件，否则返回 TRUE
}

void CWawajiRunnerDlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		CDialogEx::OnSysCommand(nID, lParam);
	}
}

// 如果向对话框添加最小化按钮，则需要下面的代码
//  来绘制该图标。  对于使用文档/视图模型的 MFC 应用程序，
//  这将由框架自动完成。

void CWawajiRunnerDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // 用于绘制的设备上下文

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// 使图标在工作区矩形中居中
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 绘制图标
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialogEx::OnPaint();
	}
}

void CWawajiRunnerDlg::OnTimer(UINT_PTR nIDEvent)
{
	if (TIMER_IDEVENT_START == nIDEvent)
	{
		
	}
	
	if (TIMER_IDEVENT_RECHECK == nIDEvent)
	{
		std::string curExeName = "WawajiDemo.exe";
		int processNum = getProcessIdMutil(curExeName);
		if (2 > processNum){

			WinExec("WawajiDemo.exe", SW_HIDE);
		}

		bool frontStatus = str2int(gWawajiConfig.getDeviceState(INI_DeviceInfoFront));
		if (frontStatus){
			GetDlgItem(IDC_EDIT_FRONT)->SetWindowTextW(_T("已启动"));
		}
		else{
			GetDlgItem(IDC_EDIT_FRONT)->SetWindowTextW(_T("未启动"));
		}

		bool backStatus = str2int(gWawajiConfig.getDeviceState(INI_DeviceInfoBack));
		if (backStatus){
			GetDlgItem(IDC_EDIT_BACK)->SetWindowTextW(_T("已启动"));
		}
		else{
			GetDlgItem(IDC_EDIT_BACK)->SetWindowTextW(_T("未启动"));
		}

		processNum = getProcessIdMutil(curExeName);
		if (2 > processNum){
			if (frontStatus && backStatus){
				GetDlgItem(IDC_STATIC_TIMERSTATUS)->SetWindowTextW(_T("前后程序都已经启动..."));
			}
			else if (frontStatus && !backStatus){
				GetDlgItem(IDC_STATIC_TIMERSTATUS)->SetWindowTextW(_T("准备启动后置程序.."));
			}
			else if (!frontStatus && backStatus){
				GetDlgItem(IDC_STATIC_TIMERSTATUS)->SetWindowTextW(_T("准备启动前置程序.."));
			}
		}
	}
}

//当用户拖动最小化窗口时系统调用此函数取得光标
//显示。
HCURSOR CWawajiRunnerDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CWawajiRunnerDlg::initExe()
{
	GetDlgItem(IDC_STATIC_TIMERSTATUS)->SetWindowTextW(_T("正在启动.."));
	GetDlgItem(IDC_EDIT_FRONT)->SetWindowText(_T("未启动"));
	GetDlgItem(IDC_EDIT_BACK)->SetWindowText(_T("未启动"));

	GetDlgItem(IDC_EDIT_FRONT)->SetFocus();
	GetDlgItem(IDC_EDIT_BACK)->SetFocus();
	GetDlgItem(IDC_STATIC_TIMERSTATUS)->SetFocus();

	registerStartUp();
}

void CWawajiRunnerDlg::uninitExe()
{

}