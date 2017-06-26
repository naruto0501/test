package com.core.id;

public class UUIDHexGenerator extends AbstractUUIDGenerator{

        private String sep = "";

        protected String format(int intval) {
                String formatted = Integer.toHexString(intval);
                StringBuffer buf = new StringBuffer("00000000");
                buf.replace( 8-formatted.length(), 8, formatted );
                return buf.toString();
        }

        protected String format(short shortval) {
                String formatted = Integer.toHexString(shortval);
                StringBuffer buf = new StringBuffer("0000");
                buf.replace( 4-formatted.length(), 4, formatted );
                return buf.toString();
        }
        /**
         * 生成uuid主键
         * @return
         */
        public String generate() {
                return new StringBuffer(36)
                        .append( format( getIP() ) ).append(sep)
                        .append( format( getJVM() ) ).append(sep)
                        .append( format( getHiTime() ) ).append(sep)
                        .append( format( getLoTime() ) ).append(sep)
                        .append( format( getCount() ) )
                        .toString();
                
        }
}
