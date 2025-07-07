
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Modern tech color palette
				tech: {
					electric: '#0066FF', // Vibrant electric blue
					'electric-light': '#3B82F6', // Bright blue
					'electric-dark': '#0052CC', // Deep electric blue
					neon: '#00D4FF', // Neon cyan
					purple: '#8B5CF6', // Modern purple
					'purple-light': '#A78BFA', // Light purple
					dark: '#0A0A0B', // Near black
					'gray-50': '#FAFBFC',
					'gray-100': '#F2F4F7',
					'gray-200': '#E4E7EC',
					'gray-300': '#D0D5DD',
					'gray-400': '#98A2B3',
					'gray-500': '#667085',
					'gray-600': '#475467',
					'gray-700': '#344054',
					'gray-800': '#1D2939',
					'gray-900': '#101828'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(0, 102, 255, 0.6)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'slide-up': 'slide-up 1s ease-out',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite'
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'soft': '0 4px 20px -2px rgba(0, 102, 255, 0.15)',
				'card': '0 4px 12px -2px rgba(16, 24, 40, 0.08)',
				'button': '0 2px 8px -2px rgba(0, 102, 255, 0.4)',
				'neon': '0 0 20px rgba(0, 212, 255, 0.5)',
				'electric': '0 8px 32px rgba(0, 102, 255, 0.2)'
			},
			backgroundImage: {
				'gradient-tech': 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)',
				'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
				'gradient-dark': 'linear-gradient(135deg, #0A0A0B 0%, #1D2939 100%)'
			}
		}
	},
       plugins: [animate],
} satisfies Config;
